import ProductDto from "../dto/Product/ProductDto";
import ActivityDto from "../dto/ActivityDto";
import ProductGroupDto from "../dto/Product/ProductGroupDto";
import ActivityTypeDto from "../dto/ActivityTypeDto";
import {productActions} from "../data/productActionsData";
import ActivityGroupDto from "../dto/ActivityGroupDto";
import DateUtils from "../utils/DateUtils";
import ProductSuggestionDto from "../dto/Product/ProductSuggestionDto";
import ProductDefDto from "../dto/Product/ProductDefDto";
import ProductCategoryDto, {ProductCategoryGroupDto} from "../dto/Product/ProductCategoryDto";

class ProductService {

  groupProductsByNameAndUnit(products: ProductDto[]): ProductGroupDto[] {
    let groupedProducts: ProductGroupDto[] = [];
    products.forEach(product => {
      const productDef = product.definition;
      let groupedProduct = groupedProducts.filter(value => value._id.toString() === productDef._id.toString())[0];
      if(groupedProduct) {
        groupedProduct.items = [...groupedProduct.items, product];
      } else {
        groupedProduct = {
          _id: productDef._id,
          name: productDef.name,
          unitName: productDef.unitName,
          iconName: productDef.iconName,
          category: productDef.category,
          isActive: productDef.isActive,
          items: [product],
        };
        groupedProducts = [...groupedProducts, groupedProduct];
      }
    });
    return groupedProducts;
  }

  getProductAction(name: string): ActivityTypeDto {
    return productActions.filter(p => p.name === name)[0];
  }

  groupActivityByDay(activities: ActivityDto[]): ActivityGroupDto[] {
    let activityGroupDtos: ActivityGroupDto[] = [];
    activities.forEach(item => {
      let activityGroupDto: ActivityGroupDto = activityGroupDtos.filter(value => {
          return DateUtils.areDatesWithinOneDay(item.actionDate, value.date);
      })[0];
      if(activityGroupDto) {
        activityGroupDto.items = [...activityGroupDto.items, item];
      } else {
        activityGroupDto = {
          day: DateUtils.convertDateToDayString(item.actionDate),
          date: item.actionDate,
          items: [item]
        };
        activityGroupDtos = [...activityGroupDtos, activityGroupDto];
      }
    });
    return activityGroupDtos;
  }

  convertActivitiesToProductSuggestions(activities: ActivityDto[], productDefs: ProductDefDto[]): ProductSuggestionDto[] {
    const suggestions = activities.map(activity => {
      const productDef = activity.product.definition;
      const product = activity.product;
      const diffDates = DateUtils.getDiffDays(product.expirationDate, activity.actionDate);

      return {
        productDef: productDef,
        currentUnitValue: product.unitValue,
        daysToExpire: diffDates,
        unitValue: activity.unitValue,
        massValue: product.massValuePerUnit || 0,
      }
    });

    return this.addProductDefsToProductSuggestions(suggestions, productDefs);
  }

  addProductDefsToProductSuggestions(initProductSuggestions: ProductSuggestionDto[], productDefs: ProductDefDto[]): ProductSuggestionDto[] {
    let productSuggestions = initProductSuggestions;
    const suggestionIds = productSuggestions.map(item => item.productDef._id.toString());
    productDefs
      .filter(item => !suggestionIds.includes(item._id.toString()))
      .forEach(item => {
        productSuggestions.push({
          productDef: item,
          currentUnitValue: 0,
          daysToExpire: 3,
          unitValue: 1,
          massValue: 0
        });
      });
    return productSuggestions;
  }

  groupProductsByCategories(categories: ProductCategoryDto[], productGroups: ProductGroupDto[]): ProductCategoryGroupDto[] {
    let productCategoriesList: ProductCategoryGroupDto[] = [];
    const noCategoryDto = categories.filter(item => item.isDefault)[0];
    if(!noCategoryDto) return [];
    categories.filter(item => !item.isDefault).forEach(category => {
      const filteredProductGroups = productGroups.filter(productGroup => productGroup.category?._id.equals(category._id));
      if(filteredProductGroups.length > 0) {
        productCategoriesList.push({name: category.name, productGroups: filteredProductGroups});
      }
    });
    const productsWithNoCategory = productGroups
      .filter(productGroup => !productGroup.category || productGroup.category._id.equals(noCategoryDto._id));
    if(productsWithNoCategory.length > 0) {
      productCategoriesList.push({name: noCategoryDto.name, productGroups: productsWithNoCategory});
    }
    return productCategoriesList;
  }
}

export const productService = new ProductService();
