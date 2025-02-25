import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  expenses: any[] = [];
  filteredExpenses: any[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory: string | null = null;
  selectedGroup: string | null = null;
  
  categories: any[] = [];
  groups: Set<string> = new Set();
  
  constructor(private expenseService: ExpenseService) { }
  
  ngOnInit(): void {
    this.loadExpenses();
  }
  
  loadExpenses(): void {
    this.isLoading = true;
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
      this.filteredExpenses = [...expenses];
      
      // Extract unique categories and groups for filters
      this.categories = this.expenseService.getCategories();
      this.expenses.forEach(expense => {
        if (expense.group) {
          this.groups.add(expense.group.name);
        }
      });
      
      this.isLoading = false;
    });
  }
  
  applyFilters(): void {
    this.filteredExpenses = this.expenses.filter(expense => {
      // Apply search term filter
      const matchesSearchTerm = !this.searchTerm || 
        expense.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Apply category filter
      const matchesCategory = !this.selectedCategory || 
        expense.category.name === this.selectedCategory;
      
      // Apply group filter
      const matchesGroup = !this.selectedGroup || 
        (expense.group && expense.group.name === this.selectedGroup);
      
      return matchesSearchTerm && matchesCategory && matchesGroup;
    });
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  onCategoryFilter(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  onGroupFilter(group: string | null): void {
    this.selectedGroup = group;
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedGroup = null;
    this.filteredExpenses = [...this.expenses];
  }
}
