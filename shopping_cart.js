let emptyCart = [];

module.exports.addItem = (meal)=>{
    return new Promise((res,rej)=>{
     emptyCart.push(meal);
        res (emptyCart.length);
    });
}

module.exports.checkout = ()=>{
    return new Promise((res, rej)=>{
        let price=0;
        if(emptyCart){
            emptyCart.forEach(x => {
                price += x.price;
            });
        }
        res(price);
    });
}

module.exports.removeItem = (meal)=>{
    return new Promise((res,rej)=>{
        for(let i = 0; i< emptyCart.length; ++i){
            if (emptyCart[i].name == meal){
             emptyCart.splice(i,1);
                i = emptyCart.length;
            }
        }
        res();
    });
}

module.exports.getShoppingCart = ()=>{
    return new Promise((resolve, reject)=>{
            resolve (emptyCart);
    });
}

module.exports.removeAll = ()=>{
    return new Promise((resolve, reject)=>{
            emptyCart =[];
            resolve (emptyCart);
    });
}

