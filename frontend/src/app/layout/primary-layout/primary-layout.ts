import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-primary-layout',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './primary-layout.html',
})
export class PrimaryLayout {

}
