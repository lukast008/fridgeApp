import { icons } from "../data/iconsData"
import IconDto from "../dto/IconDto";

export default class IconService {
  static getDefaultIcon = () => {
    return icons.filter(item => item.name === "groceries")[0];
  }

  static getAllIcons = () => {
    return icons;
  }

  static filterIconsByTag = (name: string) => {
    return icons.filter(item => {
      if(item.tags && item.tags.length > 0) {
        return item.tags.map(tag => tag.toLowerCase()).includes(name.toLowerCase());
      } else {
        return false;
      }
    });
  }

  static getIconByName = (name: string) => {
    return icons.filter(item => item.name === name)[0];
  }

  static findIconForName(name: string) {
    const icons: IconDto[] = IconService.filterIconsByTag(name);
    if(icons && icons.length > 0) return icons[0];
    else return IconService.getDefaultIcon();
  }
}
