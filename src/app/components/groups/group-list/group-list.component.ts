import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  groups: any[] = [];
  isLoading = true;
  
  constructor(private groupService: GroupService) { }
  
  ngOnInit(): void {
    this.loadGroups();
  }
  
  loadGroups(): void {
    this.isLoading = true;
    this.groupService.getGroups().subscribe(
      groups => {
        this.groups = groups;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading groups:', error);
        this.isLoading = false;
      }
    );
  }
}
