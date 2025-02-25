import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { GroupService } from '../../../services/group.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  categories: any[] = [];
  groups: any[] = [];
  members: any[] = [];
  isEditing = false;
  expenseId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  currentUser: any;
  splitTypes = [
    { id: 'equal', name: 'Split Equally' },
    { id: 'exact', name: 'Enter Exact Amounts' },
    { id: 'percentage', name: 'Enter Percentages' }
  ];
  selectedSplitType = 'equal';
  
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      categoryId: [null, Validators.required],
      groupId: [null],
      paidById: [null, Validators.required],
      splitType: ['equal'],
      participants: this.fb.array([])
    });
  }
  
  ngOnInit(): void {
    this.isLoading = true;
    
    // Get current user
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      // Default payer is current user
      this.expenseForm.get('paidById')?.setValue(user.id);
    });
    
    // Check if editing existing expense
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.expenseId = +params['id'];
        this.loadExpenseForEditing(this.expenseId);
      } else {
        this.isLoading = false;
      }
    });
    
    // Load categories
    this.expenseService.getCategories().subscribe(categories => {
      this.categories = categories;
      if (categories.length > 0 && !this.isEditing) {
        this.expenseForm.get('categoryId')?.setValue(categories[0].id);
      }
    });
    
    // Load groups
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
    
    // Load contacts
    this.groupService.getAllContacts().subscribe(contacts => {
      this.members = contacts;
      
      // If not editing, add current user as participant by default
      if (!this.isEditing) {
        this.addParticipant(this.currentUser);
      }
    });
  }
  
  get participantsArray(): FormArray {
    return this.expenseForm.get('participants') as FormArray;
  }
  
  loadExpenseForEditing(id: number): void {
    this.expenseService.getExpenseById(id).subscribe(expense => {
      if (expense) {
        // Populate form with expense data
        this.expenseForm.patchValue({
          description: expense.description,
          amount: expense.amount,
          date: new Date(expense.date).toISOString().split('T')[0],
          categoryId: expense.category.id,
          groupId: expense.group ? expense.group.id : null,
          paidById: expense.paidBy.id,
          splitType: 'equal' // Assuming equal split for this example
        });
        
        // Add participants
        this.clearParticipants();
        expense.participants.forEach((participant: any) => {
          const member = this.members.find(m => m.id === participant.id);
          if (member) {
            this.addParticipant(member, participant.share);
          }
        });
      }
      this.isLoading = false;
    });
  }
  
  addParticipant(member: any, share?: number): void {
    // Check if participant already exists
    const exists = this.participantsArray.controls.some(
      control => control.get('id')?.value === member.id
    );
    
    if (!exists) {
      const participantGroup = this.fb.group({
        id: [member.id],
        name: [member.name],
        share: [share || 0]
      });
      
      this.participantsArray.push(participantGroup);
      this.updateShares();
    }
  }
  
  removeParticipant(index: number): void {
    this.participantsArray.removeAt(index);
    this.updateShares();
  }
  
  clearParticipants(): void {
    while (this.participantsArray.length) {
      this.participantsArray.removeAt(0);
    }
  }
  
  updateShares(): void {
    const totalAmount = +this.expenseForm.get('amount')?.value || 0;
    const participantCount = this.participantsArray.length;
    
    if (participantCount === 0 || totalAmount === 0) return;
    
    const splitType = this.expenseForm.get('splitType')?.value;
    
    if (splitType === 'equal') {
      const equalShare = totalAmount / participantCount;
      for (let i = 0; i < participantCount; i++) {
        this.participantsArray.at(i).get('share')?.setValue(equalShare.toFixed(2));
      }
    }
    // For other split types, shares would be manually entered by the user
  }
  
  onSplitTypeChange(splitType: string): void {
    this.selectedSplitType = splitType;
    this.expenseForm.get('splitType')?.setValue(splitType);
    this.updateShares();
  }
  
  onAmountChange(): void {
    this.updateShares();
  }
  
  onGroupChange(groupId: number): void {
    if (groupId) {
      const selectedGroup = this.groups.find(g => g.id === +groupId);
      if (selectedGroup) {
        // Clear current participants
        this.clearParticipants();
        
        // Add group members as participants
        selectedGroup.members.forEach((member: any) => {
          this.addParticipant(member);
        });
      }
    }
  }
  
  onSubmit(): void {
    if (this.expenseForm.invalid) return;
    
    this.isSubmitting = true;
    
    const formData = this.expenseForm.value;
    
    // Format the expense data for saving
    const expenseData = {
      id: this.expenseId,
      description: formData.description,
      amount: +formData.amount,
      date: new Date(formData.date),
      category: this.categories.find(c => c.id === +formData.categoryId),
      paidBy: this.members.find(m => m.id === +formData.paidById),
      group: formData.groupId ? this.groups.find(g => g.id === +formData.groupId) : null,
      participants: formData.participants.map((p: any) => ({
        id: p.id,
        name: p.name,
        share: +p.share,
        paid: p.id === +formData.paidById ? +formData.amount : 0,
        balance: p.id === +formData.paidById 
          ? +p.share - +formData.amount 
          : +p.share
      }))
    };
    
    // Calculate your share for dashboard display
    const userParticipant = expenseData.participants.find((p: any) => p.id === this.currentUser.id);
    if (userParticipant) {
      expenseData.yourShare = userParticipant.balance;
    }
    
    // Save the expense
    const saveObservable = this.isEditing 
      ? this.expenseService.updateExpense(expenseData)
      : this.expenseService.createExpense(expenseData);
      
    saveObservable.subscribe(
      () => {
        this.isSubmitting = false;
        this.router.navigate(['/expenses']);
      },
      error => {
        this.isSubmitting = false;
        console.error('Error saving expense:', error);
      }
    );
  }
}
