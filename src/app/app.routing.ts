import { ModuleWithProviders } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
// import user
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';

//import de artista
import { ArtistListComponent } from'./components/artist-list.component';
import { ArtistAddComponent } from'./components/artist-add.component';
import { ArtistEditComponent } from'./components/artist-edit.component';
import { ArtistDetailComponent } from'./components/artist-detail.component';
//import de album
import { AlbumListComponent } from'./components/album-list.component';
import { AlbumAddComponent } from'./components/album-add.component';
import { AlbumEditComponent } from'./components/album-edit.component';
import { AlbumDetailComponent } from'./components/album-detail.component';
//import de song
import { SongAddComponent} from './components/song-add.component';
import { SongDetailComponent} from './components/song-detail.component';
import { SongEditComponent} from './components/song-edit.component';

const appRoutes: Routes = [
		{path: '', component: HomeComponent},
		{path: 'mis-datos', component: UserEditComponent},
		{path: 'artistas/:page?',component: ArtistListComponent},
		{path: 'albums/:artist?',component: AlbumListComponent},
		{path: 'artista/:id', component: ArtistDetailComponent},
		{path: 'album-add/:artist', component: AlbumAddComponent},
		{path: 'album-edit/:album', component: AlbumEditComponent},
		{path: 'album/:album', component: AlbumDetailComponent},
		{path: 'crear-artista',component: ArtistAddComponent},
		{path: 'editar-artista/:id', component: ArtistEditComponent},
		{path: 'song-add/:album', component: SongAddComponent},
		{path: 'song/:song',component: SongDetailComponent},
		{path: 'song-edit/:song',component: SongEditComponent},
		{path: '**', component: HomeComponent},

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);