
$(function(){
    window.onscroll=function(){
        var scroll_top=$(document).scrollTop();
        if (scroll_top>=100){
            $('.back-top-btn').slideDown();
        }else{
            $('.back-top-btn').slideUp();
        }
    };
})
function bindBackTop(){
    window.scrollTo(0);
}


// add shopping cart
function addToShoppingCart(good_sha1){
    // check shopping list in cache

    var good_obj = JSON.parse(sessionStorage.getItem('latest_visited'));
    // check goods obj sha1
    if (good_obj['sha1'] != good_sha1){
        console.log('add shopping cart error!');
        return;
    }
    if (localStorage.getItem('shopping_cart')){
        var shopping_list = JSON.parse(localStorage.getItem('shopping_cart'));
    }else{
        var shopping_list = [];
    }
    var exist = false;
    for (var i=0;i<shopping_list.length;i++){
        if (shopping_list[i]['sha1'] == good_sha1){
            // 如果商品再购物车中存在，修改商品的数量
            exist = true;
            shopping_list[i]['count'] = parseInt(shopping_list[i]['count'])+1;
        }
    }
    // 如果商品再购物车中不存在，添加到购物车中
    if (exist == false){
        // add goods into shopping list
        good_obj['count'] = 1;
        good_obj['checked'] = false;
        shopping_list.push(good_obj);
    }
    // update shopping cart
    localStorage.setItem('shopping_cart',JSON.stringify(shopping_list));
}

// reditect to shopping cart page

function reditectShoppingCartPage(){
    location.href='/single/cart/';
}


// show my shopping cart
function showMyShoppingCart(){
    // get shopping list from cache
    if (localStorage.getItem('shopping_cart')){
        var shopping_list = JSON.parse(localStorage.getItem('shopping_cart'));
    }else{
        console.log('empty shopping cart!');
    }
    // render shopping list
}


// init shopping cart

function initShoppingCart(){
    localStorage.removeItem('shopping_cart');
}