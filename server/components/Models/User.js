'use strict';
let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();

/**
 * Clase usuario
 */
class User {

  constructor(){
    this.collection = 'users';
    this.schema = {
      _id : 'S',
      email : 'S',
      password : 'S',
      wishlists : 'M',
      followers : 'M',
      followings : 'M',
      requiredFields : ['_id', 'email', 'password']
    };
  }

  getById(req, userId, projection) {
    projection = projection || {_id: 1, email: 1, wishlists: 1, followers: 1, followings: 1};
    return new Promise((resolve, reject) => {
      App.log().info(req, 'MongoDB: obteniendo usuario' + userId);
      App.DB().mongoDb().collection(this.collection).findOne({_id: userId}, projection, (err, item)=> {
        return (err || !item) ? reject(err || {msg: 'Non existent user ', code: 404}) : resolve(item);
      });
    });
  }

  login(req, values){ //TODO HACER LOGIN CON EMAIL TAMBIEN (lo mismo pero mirando si hay un @ y entonces comparar  con email)
    let $this = this;
    return new Promise((resolve, reject) => {
      let projection = {
        _id : 1,
        email: 1,
        password : 1,
        wishlists : 1,
        followers : 1,
        followings : 1
      };

      App.log().info(req,'MongoDB: login usuario'+JSON.stringify(values));
      $this.getById(req, values.nickname,projection).then(
        (user) =>{
          if(user.password === values.password){
            delete user.password;
            resolve(user)
          } else {
            reject({ code : 412 , msg : 'Password does not match'});
          }
        },(err) => reject(err)
      );
    });
  }

  create(req,values){
    return new Promise((resolve,reject)=>{
      try{
        Utils.valSchema(values,this.schema);
      }catch(e){
        return reject({ msg : e , code : 412 });
      }
      App.log().info(req,'MongoDB: creando usuario con valores '+JSON.stringify(values));
      App.DB().mongoDb().collection(this.collection).insert(values,(err)=> {
            return (err) ? reject(err) : resolve(values);
      });
    });
  }

  addWish(req, values){
    let $this = this;
    let userId = values.user;
    let wishId = values.wish;

    return new Promise((resolve, reject)=>{
      let Wishlist = App.getModel('Wishlist');
      App.log().info(req,'MongoDB: añadiendo wish en usuario con valores '+JSON.stringify(values));
      this.getById(req, userId, {_id:0, wishlists: 1}).then(
        (user) => {
          if(!user.wishlists){
            Wishlist.create(req, 'My Wishlist').then(
              (wishlistId) => {
                user.wishlists = [wishlistId];
                $this.update(req, userId, {wishlists: user.wishlists}).then(
                  () => Wishlist.addWish(req, wishlistId, wishId).then(
                      ()=> resolve(),
                      err => reject(err)
                    ),
                  err => reject(err)
                )
              },err => reject(err)
            )
          } else {
            let wishlistId = user.wishlist[0]; //TODO CAMBIAR PARA SELECCIONAR LA LIsTA
            Wishlist.addWish(req, wishlistId, wishId).then(
              ()=>  resolve(),
              err => reject(err)
            )
          }
        },err => reject(err)
      );
    })
  }

  update(req,userId,values){
    return new Promise((resolve,reject)=>{
      App.log().info(req,'MongoDB: Actualizando usuario '+userId+' con valores '+JSON.stringify(values));
      delete values._id;
      App.DB().mongoDb().collection(this.collection).updateOne({ _id : userId },{ $set : values },(err)=>{
        return (err)?reject(err):resolve();
      });
    });
  }


}

module.exports = User;
