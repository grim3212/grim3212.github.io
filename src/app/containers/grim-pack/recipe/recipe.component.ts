import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'crafting-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  @Input() recipe: any;
  @Input() recipeName: any;

  constructor() { }

  ngOnInit() {
    if (!this.recipe) {
      throw new Error('Attribute \'recipe\' is required!');
    }
  }

  getImage(item: any, large: boolean) {
    const itemPath = item.id.replace(':', '/');
    return `assets/grimpack/icons/${itemPath}/${item.meta}/${large ? 64 : 32}.png`;
  }

  getRecipeName() {
    if (this.recipeName) {
      return this.recipeName;
    }

    return this.recipe.recipeType;
  }

  getCraftingImage(large: boolean) {
    const path = `assets/grimpack/gui/crafting_table`;
    if (large) {
      return path + `_large.png`;
    } else {
      return path + `.png`;
    }
  }

  getMachineImage(type: any) {
    return `assets/grimpack/gui/${type.toLowerCase()}.png`;
  }

  getRouterLink(item: any) {
    if (item.link) {
      return `/grim-pack/${item.part}/${item.chapter}`;
    }
    return '/grim-pack/core';
  }

  getToolTip(item: any) {
    let tooltip = '';

    if (item.tooltip) {

      //Change the color of name
      if (item.tooltip[0].indexOf('<font') == -1) {
        item.tooltip[0] = `<font class="text-primary font-weight-bold">${item.tooltip[0]}</font>`;
      }

      //Build the tooltip
      for (const tip of item.tooltip) {
        tooltip += tip + '<br>';
      }
    } else {
      tooltip = `<font class="text-primary font-weight-bold">${item.name}</font><br>`;
    }

    //Add in ore dict names
    if (item.oreName) {
      tooltip += 'Accepts any: ' + item.oreName + '<br>';
    }

    return tooltip;
  }
}
