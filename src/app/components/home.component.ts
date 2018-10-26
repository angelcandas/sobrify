import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';	

@Component({
	selector: 'artist-list',
	templateUrl: '../views/home.html',
  	providers: [UserService]
})

export class HomeComponent implements OnInit{
	public titulo: string;
	public identity;
	public token;
	public url: string;	
	

	constructor(
		private _userService: UserService,
		private _route: ActivatedRoute,
		private _router: Router,
	){
		this.titulo = 'Home';
		this.identity = _userService.getIdentity();
		console.log("Home.component esta cargado")
	}
	ngOnInit(){

	}
}