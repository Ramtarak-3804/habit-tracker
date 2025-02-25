import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  isLoading = true;
  isSaving = false;
  successMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      currency: ['USD']
    });
  }
  
  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      
      // Set form values
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        currency: user.currency || 'USD'
      });
      
      this.isLoading = false;
    });
  }
  
  onSubmit(): void {
    if (this.profileForm.invalid) return;
    
    this.isSaving = true;
    this.successMessage = '';
    
    // In a real app, you'd call an API to update the profile
    // For now, we'll just simulate a delay
    setTimeout(() => {
      const updatedProfile = {
        ...this.user,
        ...this.profileForm.value
      };
      
      // Update local user data
      localStorage.setItem('currentUser', JSON.stringify(updatedProfile));
      this.user = updatedProfile;
      
      this.isSaving = false;
      this.successMessage = 'Profile updated successfully!';
    }, 1000);
  }
  
  changePassword(): void {
    // In a real app, implement password change functionality
    alert('Password change functionality would be implemented here.');
  }
}
