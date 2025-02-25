import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  groupForm: FormGroup;
  contacts: any[] = [];
  isEditing = false;
  groupId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  currentUser: any;
  
  groupIcons = [
    { id: 'fa-users', name: 'Friends' },
    { id: 'fa-home', name: 'Home' },
    { id: 'fa-building', name: 'Work' },
    { id: 'fa-plane', name: 'Trip' },
    { id: 'fa-heart', name: 'Couple' },
    { id: 'fa-graduation-cap', name: 'School' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      icon: ['fa-users'],
      members: this.fb.array([])
    });
  }
  
  ngOnInit(): void {
    this.isLoading = true;
    
    // Get current user
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    
    // Check if editing existing group
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.groupId = +params['id'];
        this.loadGroupForEditing(this.groupId);
      } else {
        this.isLoading = false;
      }
    });
    
    // Load contacts
    this.groupService.getAllContacts().subscribe(contacts => {
      this.contacts = contacts;
      
      // If not editing, add current user as member by default
      if (!this.isEditing) {
        const currentUserContact = this.contacts.find(c => c.id === this.currentUser?.id);
        if (currentUserContact) {
          this.addMember(currentUserContact);
        }
      }
    });
  }
  
  get membersArray(): FormArray {
    return this.groupForm.get('members') as FormArray;
  }
  
  loadGroupForEditing(id: number): void {
    this.groupService.getGroupById(id).subscribe(group => {
      if (group) {
        // Populate form with group data
        this.groupForm.patchValue({
          name: group.name,
          description: group.description,
          icon: group.icon || 'fa-users'
        });
        
        // Add members
        this.clearMembers();
        group.members.forEach((member: any) => {
          const contact = this.contacts.find(c => c.id === member.id);
          if (contact) {
            this.addMember(contact);
          }
        });
      }
      this.isLoading = false;
    });
  }
  
  addMember(contact: any): void {
    // Check if member already exists
    const exists = this.membersArray.controls.some(
      control => control.get('id')?.value === contact.id
    );
    
    if (!exists) {
      const memberGroup = this.fb.group({
        id: [contact.id],
        name: [contact.name],
        email: [contact.email]
      });
      
      this.membersArray.push(memberGroup);
    }
  }
  
  removeMember(index: number): void {
    // Don't allow removing current user
    const memberId = this.membersArray.at(index).get('id')?.value;
    if (memberId !== this.currentUser?.id) {
      this.membersArray.removeAt(index);
    }
  }
  
  clearMembers(): void {
    while (this.membersArray.length) {
      this.membersArray.removeAt(0);
    }
  }
  
  onSubmit(): void {
    if (this.groupForm.invalid) return;
    
    this.isSubmitting = true;
    
    const formData = this.groupForm.value;
    
    // Format the group data for saving
    const groupData = {
      id: this.groupId,
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      members: formData.members,
      memberCount: formData.members.length,
      balance: 0, // Default balance
      expenses: []
    };
    
    // Save the group
    const saveObservable = this.isEditing 
      ? this.groupService.updateGroup(groupData)
      : this.groupService.createGroup(groupData);
      
    saveObservable.subscribe(
      () => {
        this.isSubmitting = false;
        this.router.navigate(['/groups']);
      },
      error => {
        this.isSubmitting = false;
        console.error('Error saving group:', error);
        // Handle error
      }
    );
  }
}
