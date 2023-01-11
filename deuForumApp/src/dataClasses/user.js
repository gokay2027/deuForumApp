class User {

    constructor(username,email){
        this.username=username;
        this.email=email;
    }

    getName = ()=>{
        return this.username;
    }
    

}
export default User;