describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    console.log(`Checking product item 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON
    for (let i = 0; i < prodItemsData.size; i++) {
      firstValue = prodItemsData[i];
      if (firstValue.title.length == 0) { allArePopulated = false; }
      if (firstValue.price.length == 0) { allArePopulated = false; }
      if (firstValue.image.length == 0) { allArePopulated = false; }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    /**
    **** TODO - STEP 1 ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found
    * Remove the .skip from this it once you are finished writing this test.
    */
  
    //I wrote a for-loop around 'firstValue' and changed prodItemsData[0] to increment through the map

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    /**
     **** TODO - STEP 2 **** 
     * Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
     * Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
     * Once you have the button, you can click it and check the innerText property of the button.
     * Once you have the innerText property, use innerText.jsonValue() to get the text value of it
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    //Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
    const prodItem = await page.$('product-item');

    //Grab the shadowRoot of that element (it's a property)
    const prodItemShadowRoot = await prodItem.evaluateHandle(prodItem => prodItem.shadowRoot);
     
    //Then query a button from that shadowRoot.
    const prodShadowButton = await prodItemShadowRoot.$('button');

    //Once you have the button, you can click it and check the innerText property of the button.
    await prodShadowButton.click();

    //Once you have the innerText property, use innerText.jsonValue() to get the text value of it
    const innerTextProp = await prodShadowButton.getProperty('innerText');
    expect(await innerTextProp.jsonValue()).toBe('Remove from Cart');

    //Click again to reset for next test
    await prodShadowButton.click();
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    /**
     **** TODO - STEP 3 **** 
     * Query select all of the <product-item> elements, then for every single product element
       get the shadowRoot and query select the button inside, and click on it.
     * Check to see if the innerText of #cart-count is 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    
    await page.evaluate(() => {
      //Query select all of the <product-item> elements
      const products = document.querySelectorAll('product-item');

      //For every single product element get the shadowRoot
      for (let i = 0; i < products.length; i++) {
        
        //Query select the button inside, and click on it.
        products[i].shadowRoot.querySelector('button').click();
      }

    });

    //Check to see if the innerText of #cart-count is 20
    let cart = await page.$("#cart-count");
    let cart_count = await cart.getProperty('innerText');
    expect(await cart_count.jsonValue()).toBe('20');


  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 4 **** 
     * Reload the page, then select all of the <product-item> elements, and check every
       element to make sure that all of their buttons say "Remove from Cart".
     * Also check to make sure that #cart-count is still 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    //Reload the page
    await page.reload();

    //Select all of the <product-item> elements
    const products = await page.$$('product-item')

    //Check every element to make sure that all of their buttons say "Remove from Cart".
    let removeFromCartFlag = await page.$$eval('product-item', (prodItems) => {
      //Check every element to make sure that all of their buttons say "Remove from Cart".
      for (let i = 0; i < prodItems.length; i++) {
        if (prodItems[i].shadowRoot.querySelector('button').innerText != 'Remove from Cart') {
          return false;
        }
      }
      return true;
    });
    expect(removeFromCartFlag).toBe(true);

    //Check to make sure that #cart-count is still 20
    let cart = await page.$("#cart-count");
    let cart_count = await cart.getProperty('innerText');
    expect(await cart_count.jsonValue()).toBe('20');

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it.skip('Checking the localStorage to make sure cart is correct', async () => {

    /**
     **** TODO - STEP 5 **** 
     * At this point the item 'cart' in localStorage should be 
       '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    //Check to make sure the item 'cart' in localStorage is '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]'
    const cartItem = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartItem).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it.skip('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    /**
     **** TODO - STEP 6 **** 
     * Go through and click "Remove from Cart" on every single <product-item>, just like above.
     * Once you have, check to make sure that #cart-count is now 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    //Go through and click "Remove from Cart" on every single <product-item>
    

    //Check to make sure that #cart-count is now 0



  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it.skip('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 7 **** 
     * Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
       is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
     * Also check to make sure that #cart-count is still 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    //Reload the page once more
    await page.reload();
    
    //Go through each <product-item> to make sure that it has remembered nothing
    //is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".


    //Check to make sure that #cart-count is still 0
    let cart = await page.$("cart-count");
    let cart_count = await cart.getProperty('innerText');
    expect(await cart_count.jsonValue()).toBe('0');
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    /**
     **** TODO - STEP 8 **** 
     * At this point he item 'cart' in localStorage should be '[]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

     //Check to make sure the item 'cart' in localStorage is '[]'
    const cartItem = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartItem).toBe('[]');

  });
});
