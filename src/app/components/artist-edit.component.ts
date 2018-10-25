import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';


@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _uploadService: UploadService,
	){
		this.titulo = 'Editar artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist("","","");
		this.is_edit = true;
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
		// Llamar al metodo del api para sacar un artista en base a su id
		this.getArtist();
	}
	getArtist(){
		this._route.params.forEach((params)=>{
			let id = params['id'];
			this._artistService.getArtist(this.token,id).subscribe(
				res =>{
					if(!res.artist){
						console.log("no recibo artista")
						this._router.navigate(['/'])
					}else{
					this.artist = res.artist;
					}
				},
				error=>{
					var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.alertMessage=body.message
			  			}
				})
		})
	}
	
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
			let id = params ['id']
			this._artistService.editArtist(this.token,id,this.artist).subscribe(
				response=>{
						if(!response.artistUpdated){
							this.alertMessage='Error en el servicio'
						}else{
							this.alertMessage=this.artist.name+' se ha editado correctamente';
							//this.artist = response.artistStored;
							//this._router.navigate(['/editar-artista'],response.artist._id)
							// Subir la imagen del artista
							if(!this.filesToUpload){
								this._router.navigate(['/artistas',1])
							}else{
							this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id,[],this.filesToUpload,this.token,'image')
							.then(
								(result)=>{
									this._router.navigate(['/artistas',1])
								},
								(error)=>{
									console.log(error);
								})
							}
							}
						
				},
				error=>{
					var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.alertMessage=body.message
			  			}
					})
		});
	}
	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}