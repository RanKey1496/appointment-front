import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookComponent } from './book/book.component';
import { ContactComponent } from './contact/contact.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agendar', component: BookComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'whatsapp', component: WhatsappComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
