import { Injectable } from "@angular/core";
import { UserManager,User } from "oidc-client";
import { Subject } from "rxjs";
import { Constants } from "../constants";
import { CoreModule } from "./core.module";
@Injectable({
    providedIn:'root'

})

export class AuthService{

    private _userManager:UserManager;
    private _user:User;
    private _loginChangedSubject=new Subject<boolean>();

    loginChanged=this._loginChangedSubject.asObservable();

    constructor(){
        const stsSettings={
            authority:Constants.stsAuthority,
            client_id:Constants.clientId,
            redirect_uri:`${Constants.clientRoot}signin-callback`,
            scope:'openid profile projects-api',
            response_type:'code',
            post_logout_redirect_uri:`${Constants.clientRoot}signout-callback`,
            automaticSilentRenew:true,
            silent_redirect_uri:`${Constants.clientRoot}assets/silent-callback.html`

        }
        this._userManager=new UserManager(stsSettings);
        this._userManager.events.addAccessTokenExpired(_=>{
            this._loginChangedSubject.next(false);

        });
    }

    login(){
        return this._userManager.signinRedirect();
    }

    isLoggedIn():Promise<boolean>{
        return this._userManager.getUser().then(user=>{
            const userCurrent=!!user&&!user.expired;
            if (this._user!==user){
                this._loginChangedSubject.next(userCurrent);
            }
            this._user=user;
            return userCurrent;
        });
    }

    completeLogin(){
        return this._userManager.signinRedirectCallback().then(user=>{
            this._user=user;
            this._loginChangedSubject.next(!!user&&!user.expired);
            return user;

        });
      }

      logout(){
          this._userManager.signoutRedirect();
      }

      completeLogout(){
          this._user=null;
          this._loginChangedSubject.next(false);
          return this._userManager.signoutRedirectCallback();
      }

      getAccessToken(){
          return this._userManager.getUser().then(user=>{
              if(!!user && !user.expired){
                  return user.access_token;
              }
              else{
                  return null;
              }
          })
      }
}