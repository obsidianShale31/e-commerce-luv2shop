import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = "";


  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }


  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // If we have a different keyword than previous, then set the page number to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // Now search for the products using the keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize, theKeyword).subscribe(this.processResult());
  }


  handleListProducts() {
    // Check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // Get the id param string. Convert string to a number using the + symbol
      // Use the ! symbol to tell the compiler that the object is not null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // Get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    } else {
      // Not category id available... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // Check if we have a different category than previous
    // Note: Angular will resue a component if it's currently being viewed

    // If we have a different category ID than previous, then set the page number back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // Now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
  }


  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();  //refresh the page
  }


  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }


  addToCart(theProduct: Product) {
    // Add the item to the cart using the service
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
