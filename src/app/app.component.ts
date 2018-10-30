import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';	
import { User } from './models/user';
import { GLOBAL } from './services/global'
import { Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit{
	public title = 'MUSIFY';
	public user: User;
	public user_register: User;
	public identity;
	public token;
	public errorMessage;
	public alertRegister;
	public url:string;
	public urlfile:string;
	constructor(
		private _userService: UserService,
		private _route: ActivatedRoute,
		private _router: Router,
		){
		this.user = new User("","","","","ROLE_USER","","");
		this.user_register = new User("","","","","ROLE_USER","","");
		this.url = GLOBAL.url;
		this.urlfile = GLOBAL.urlfile;
		}
	ngOnInit(){
		this.identity=this._userService.getIdentity();
		this.token=this._userService.getToken();
	
	}

	public onSubmit(){
		this._userService.signup(this.user).subscribe(
		Response =>{
			let identity = Response;
			this.identity = identity;
			if(!this.identity._id){
				alert('El usuario no esta correctamente identificado')
			}else{
		  				//Crear elemento local Storage para tener al usuario en sesion
		  	localStorage.setItem('identity',JSON.stringify(identity))
		  				//Conseguir el token
				this._userService.signup(this.user,true).subscribe(
		  		res =>{
		  			let token = res.token;
		  			this.token = token;
		  			if(this.token.length<=0){
		  				alert('El token no se ha generado correctamente')
		  			}else{

		  				localStorage.setItem('token',token)
		  				this.user = new User("","","","","ROLE_USER","","");
		  				this._router.navigate(['/']);
		  			}
			  	},
			  	error=>{
			  		var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.errorMessage=body.message
			  			}
			  	})
			}
		},
		error=>{
			var errorMessage = <any>error;
			if (errorMessage != null) {
				var body = JSON.parse(error._body)
				this.errorMessage=body.message
				console.log(error)
			}
		})
		}



	logout(){
		localStorage.removeItem('identity')
		localStorage.removeItem('token')
		localStorage.clear();
		this.identity = null;
		this.token = null;
		this._router.navigate(['/logout']);
	}
	onSubmitRegister(){
		console.log(this.user_register)
		this._userService.register(this.user_register).subscribe(
			res =>{
				let user = res.user;
				this.user_register = user;
				if(!user._id){
					this.alertRegister='Error al registrarse'
				}else{
					this.alertRegister='Registro correcto, identificate con '+this.user_register.email
					this.user_register = new User("","","","","ROLE_USER","","");
				}
			},

			err =>{
				var errorMessage = <any>err;
				if (errorMessage != null) {
					var body = JSON.parse(err._body)
					//this.errorMessage=body.message
					//console.log(error)
				}
			})
	}
}
