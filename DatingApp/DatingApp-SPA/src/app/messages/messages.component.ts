import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userServie: UserService, 
              private authService: AuthService, private route: ActivatedRoute,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination
    });
  }

  loadMessages(){
    this.userServie.getMessages(this.authService.decodedToken.nameid,
              this.pagination.currentPage,this.pagination.itemsPerPage, 
              this.messageContainer).subscribe((res: PaginatedResult<Message[]>) => {
                this.messages = res.result;
                this.pagination = res.pagination;
              }, error =>{
                this.alertify.error(error);
              });
  }

  deleteMessage(id: number){
    this.alertify.confirm('Are you sure you want to delete this message?', () => {
      this.userServie.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message has been deleted');
      }, error => {
        this.alertify.error('Fails to delete the message');
      });
    });
   
  }

  pageChanged(event: any) : void{
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
