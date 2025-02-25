import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {
  expense: any;
  isLoading = true;
  currentUser: any;
  deleteInProgress = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    
    this.route.paramMap.subscribe(params => {
      const expenseId = Number(params.get('id'));
      if (expenseId) {
        this.loadExpense(expenseId);
      } else {
        this.router.navigate(['/expenses']);
      }
    });
  }
  
  loadExpense(id: number): void {
    this.isLoading = true;
    this.expenseService.getExpenseById(id).subscribe(
      expense => {
        this.expense = expense;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading expense:', error);
        this.isLoading = false;
        this.router.navigate(['/expenses']);
      }
    );
  }
  
  editExpense(): void {
    this.router.navigate(['/expenses/edit', this.expense.id]);
  }
  
  deleteExpense(): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.deleteInProgress = true;
      this.expenseService.deleteExpense(this.expense.id).subscribe(
        () => {
          this.deleteInProgress = false;
          this.router.navigate(['/expenses']);
        },
        error => {
          console.error('Error deleting expense:', error);
          this.deleteInProgress = false;
        }
      );
    }
  }
  
  isOwner(): boolean {
    return this.expense && this.currentUser && this.expense.paidBy.id === this.currentUser.id;
  }
}
