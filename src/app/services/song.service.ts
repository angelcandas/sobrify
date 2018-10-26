import { Injectable } from '@angular/core';
import { Http,Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Song } from '../models/song';

@Injectable()
export class  SongService{
	public identity;
	public token;
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addSong(token, song: Song){
		let params = JSON.stringify(song);
		//console.log("Parametros peticion: "+params)
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		return this._http.post(this.url+'song',params,{headers}).map(res => res.json());
	}

	getSongs(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});


		return this._http.get(this.url+'songs/'+page,options).map(res => res.json());
	}

	getSong(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'song/'+id,options).map(res => res.json());
	}

	editSong(token, id: string ,song: Song){
		let params = JSON.stringify(song);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});
		return this._http.put(this.url+'song/'+id,params,options).map(res => res.json());
	}
	deleteSong(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'song/'+id,options).map(res => res.json());
	}

}