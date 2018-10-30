import {Component,OnInit} from '@angular/core';
import {Song} from '../models/song';
import { GLOBAL } from '../services/global'

@Component({
	selector: 'player',
	template:`
	<div class="player-div row" >
		<div class="album-image col-lg-1">
			<span *ngIf="song.album">
				<img id="play-image-album" src="{{urlfile+song.album.image}}">
			</span>
			<span *ngIf="!song.album">	
				<img id="play-image-album" src="{{'../assets/images/note.png'}}"/>
			</span>
		</div>
		<div class="audio-file col-lg-5">
			<p class="col-lg-5">Reproduciendo</p>
			<span id="play-song-title" class="col-lg-5">
				
			</span>
			<span id="play-song-artist" class="col-lg-5">
				<span>
					
				</span>
			</span>
		</div>
		<div class="col-lg-5">
			<audio controls id="player">
				<source id="mp3-source" src="{{urlfile+song.file}}" type="audio/mpeg">
				Tu navegador no es compatible
			</audio>
		</div>
	</div>

	`
})

export class PlayerComponent implements OnInit{

	public url: string;
	public song;
public urlfile: string;


	constructor(){
		this.url = GLOBAL.url;
		this.song=new Song("","","","","")
		this.urlfile = GLOBAL.urlfile;
		window.onload=this.load;
	}


	ngOnInit(){
		console.log("el reproductor esta cargado")
	}

	load(){
		var song_player=localStorage.getItem('sound_song');
		this.song=JSON.parse(song_player);
		var file_path=localStorage.getItem('sound_path');
		var image_path=localStorage.getItem('sound_image');
		if(image_path){
		document.getElementById('mp3-source').setAttribute("src",file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();
		document.getElementById("play-song-title").innerHTML=this.song.name;
		document.getElementById("play-song-artist").innerHTML=this.song.album.artist.name;
		document.getElementById("play-image-album").setAttribute('src',image_path);}
	}


}