module.exports = {
    execute(reasonID){
        switch(reasonID){
            case "botacc":
                return "This account has been stolen or contains a malicious script";
            case "harrasment":
                return "This person is harrasing others and repeatetly broke the rules"
            default:
                return "OOPS, Something went wrong..."
        }
    }
}