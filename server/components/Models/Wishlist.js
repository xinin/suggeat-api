'use strict';
let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();


/**
 * Clase wishlist
 */
class Wishlist {
  constructor(){
    this.collection = 'wishlists';
    this.schema = {
      _id : 'S',
      name: 'S',
      date: 'S',
      wishes : 'M',
      requiredFields : ['_id']
    };
  }

  getById(req, wishlistId, projection) {
    projection = projection || {_id: 1, name: 1, date: 1, wishes: 1};
    return new Promise((resolve, reject) => {
      App.log().info(req, 'MongoDB: obteniendo wishlist ' + JSON.stringify(wishlistId));
      App.DB().mongoDb().collection(this.collection).findOne({_id: wishlistId}, projection, (err, item)=> {
        return (err || !item) ? reject(err || {msg: 'Non existent wishlistId ', code: 404}) : resolve(item);
      });
    });
  }

  create(req, name){
    return new Promise((resolve,reject)=>{
      App.log().info(req,'MongoDB: creando wishlist con nombre '+name);
      let values = {_id: Date.now(), name: name, date: Date.now(), wishes:[]};
      App.DB().mongoDb().collection(this.collection).insert(values,(err)=> {
        return (err) ? reject(err) : resolve(values._id);
      });
    });
  }

  addWish(req, wishlistId, wishId){
    let $this = this;
    return new Promise((resolve, reject) => {
      App.log().info(req,'MongoDB: añadiendo wish '+wishId+' a wishlist '+wishlistId);
      $this.getById(req, wishlistId, {wishes: 1}).then(
        (wishlist) =>{
          if(!wishlist.wishes){
            wishlist.wishes = [wishId];
          } else {
            wishlist.wishes.push(wishId);
          }
          $this.update(req, wishlistId, wishlist).then(
            () => {
              resolve()
            }, (err) => {
              reject(err)
            }
          )
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  update(req,wishlistId,values){
    return new Promise((resolve,reject)=>{
      App.log().info(req,'MongoDB: Actualizando wishlist '+wishlistId+' con valores '+JSON.stringify(values));
      delete values._id;
      App.DB().mongoDb().collection(this.collection).updateOne({ _id : wishlistId },{ $set : values },(err)=>{
        return (err)?reject(err):resolve();
      });
    });
  }



}

module.exports = Wishlist;
