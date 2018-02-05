import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { HomeComponent } from './containers/home/home.component';
import { AboutComponent } from './containers/about/about.component';
import { PocketPantryComponent } from './containers/pocket-pantry/pocket-pantry.component';
import { CollectionParserComponent } from './containers/collection-parser/collection-parser.component';
import { GrimPackComponent } from './containers/grim-pack/grim-pack.component';

//Grim Pack
import { RecipeComponent } from './containers/grim-pack/recipe/recipe.component';
import { DisplayStackComponent } from './containers/grim-pack/display-stack/display-stack.component';
import { ConfigComponent } from './containers/grim-pack/config/config.component';
import { ConfigPropComponent } from './containers/grim-pack/config-prop/config-prop.component';

//Error pages
import { SomethingWrongComponent } from './containers/error-pages/something-wrong/something-wrong.component';
import { PageNotFoundComponent } from './containers/error-pages/page-not-found/page-not-found.component';

//Services
import { GrimPackDataService } from './shared/grim-pack-data.service';
import { GrimPackDataResolve } from './shared/grim-pack-data.resolve';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';

import { LinkService } from './shared/link.service';

import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        PocketPantryComponent,
        CollectionParserComponent,
        GrimPackComponent,
        //Grim Pack
        RecipeComponent,
        DisplayStackComponent,
        ConfigComponent,
        ConfigPropComponent,
        //Error components
        PageNotFoundComponent,
        SomethingWrongComponent,
        SanitizeHtmlPipe
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'grim3212' }),

        FormsModule,
        HttpClientModule,
        AccordionModule.forRoot(),
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),

        RouterModule.forRoot([
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },
            {
                path: 'home', component: HomeComponent,

                // *** SEO Magic ***
                // We're using "data" in our Routes to pass in our <title> <meta> <link> tag information
                // Note: This is only happening for ROOT level Routes, you'd have to add some additional logic if you wanted this for Child level routing
                // When you change Routes it will automatically append these to your document for you on the Server-side
                //  - check out app.component.ts to see how it's doing this
                data: {
                    title: 'Homepage',
                    meta: [{ name: 'description', content: 'Homepage where you can access all of Grim3212s projects!' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/home' },
                        { rel: 'alternate', href: 'https://grim3212.com/' }
                    ]
                }
            },
            {
                path: 'about', component: AboutComponent,
                data: {
                    title: 'About',
                    meta: [{ name: 'description', content: 'Overview of Grim3212 and this website.' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/about' }
                    ]
                }
            },
            {
                path: 'pocket-pantry', component: PocketPantryComponent,
                data: {
                    title: 'Pocket Pantry',
                    meta: [{ name: 'description', content: 'Pocket Pantry a multiplatform app that gives you recipe ideas with what you have in your Pantry!' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/pocket-pantry' }
                    ]
                }
            },
            {
                path: 'collection-parser', component: CollectionParserComponent,
                data: {
                    title: 'Steam Collection Parser',
                    meta: [{ name: 'description', content: 'This can parse a Steam Collection for you to easily get a list of ids or what is included!' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/collection-parser' }
                    ]
                }
            },
            {
                path: 'grim-pack', component: GrimPackComponent,
                data: {
                    title: 'Grim Pack',
                    meta: [{ name: 'description', content: 'Grim Pack the Minecraft mod that is a combination of all of my mods in the past!' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/grim-pack' }
                    ]
                }
            },
            {
                path: 'grim-pack/:partName', component: GrimPackComponent,
                resolve: {
                    data: GrimPackDataResolve
                }
            },
            {
                path: 'grim-pack/:partName/:section', component: GrimPackComponent,
                resolve: {
                    data: GrimPackDataResolve
                }
            },
            {
                path: '404', component: PageNotFoundComponent,
                data: {
                    title: '404 - Not found',
                    meta: [{ name: 'description', content: '404 - Error' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/404' }
                    ]
                }
            },
            {
                path: 'something-wrong', component: SomethingWrongComponent,
                data: {
                    title: 'Something Went Wrong',
                    meta: [{ name: 'description', content: 'Something Went Wrong' }],
                    links: [
                        { rel: 'canonical', href: 'https://grim3212.com/something-wrong' }
                    ]
                }
            },
            {
                path: '**', redirectTo: '/404'
            }
        ], {
                // Router options
                useHash: false,
                preloadingStrategy: PreloadAllModules
            })
    ],
    providers: [
        LinkService,
        GrimPackDataService,
        GrimPackDataResolve
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
