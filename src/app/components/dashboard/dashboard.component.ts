import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  recentExpenses: any[] = [];
  owingAmount: number = 0;
  owedAmount: number = 0;
  totalBalance: number = 0;
  groups: any[] = [];
  isLoading = true;
  
  constructor(
    private expenseService: ExpenseService,
    private groupService: GroupService
  ) { }
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    
    // Get dashboard summary data
    this.expenseService.getDashboardSummary().subscribe(data => {
      this.owingAmount = data.owingAmount;
      this.owedAmount = data.owedAmount;
      this.totalBalance = data.totalBalance;
      this.isLoading = false;
    });
    
    // Get recent expenses
    this.expenseService.getRecentExpenses().subscribe(expenses => {
      this.recentExpenses = expenses;
    });
    
    // Get groups
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }
}
