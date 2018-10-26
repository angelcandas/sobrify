import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [UserService, ArtistService,AlbumService,UploadService]
})

export class AlbumEditComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public alertMessage;
	public album_id;
	public url: string;
	public urlfile: string;
	public is_edit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _uploadService: UploadService,
		){
		this.titulo = 'Editar album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album("","","2017","","")
		this.album_id='';
		this.is_edit=true;
		.urlfile = GLOBAL.urlfile;
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
		this.getAlbum();
	}

	getAlbum(){		
		this._route.params.forEach((params: Params)=>{
			let album_id = params['album'];
			this.album_id = album_id;
		})
		this._albumService.getAlbum(this.token,this.album_id).subscribe(
			response=>{
				console.log(response)
				if(!response.album){
					this.alertMessage='Error en el servicio'
				}else{
					this.album = response.album;
					console.log(this.album)
					//this.alertMessage=this.album.title+' se ha añadido correctamente';
					//this._router.navigate(['/editar-album',response.album._id])
					
				}
			},
			error=>{
				var errorMessage = <any>error;
				if (errorMessage != null) {
					var body = JSON.parse(error._body)
					this.alertMessage=body.message
				}
			})
	}
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
			let album_id = params['album'];
			this.album_id = album_id;
		})
		this._albumService.editAlbum(this.token,this.album_id,this.album).subscribe(
			response=>{
				if(!response.albumUpdated){
					this.alertMessage='Error en el servicio'
				}else{
					this.album = response.albumUpdated;
					//this._router.navigate(['/editar-album',response.albumStored._id])
					if(!this.filesToUpload){
						this.alertMessage=this.album.title+' se ha editado correctamente';
						this._router.navigate(['/artista',this.album.artist])
					}else{
						this._uploadService.makeFileRequest(this.url+'upload-image-album/'+this.album_id,[],this.filesToUpload,this.token,'image')
						.then(
							(result)=>{
								this.alertMessage=this.album.title+' se ha editado correctamente';
								this._router.navigate(['/artista',this.album.artist])
							},
							(error)=>{
								console.log(error['message'])
								var errorMessage = <any>error;
								if (errorMessage != null) {
									var body = error
									this.alertMessage=error
								}
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
		
	}

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

}