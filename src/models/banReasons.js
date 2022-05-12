module.exports = {
    execute(reasonID){
        switch(reasonID){
            case "botacc":
                return "This account has been stolen or contains a malicious script";
            case "harassment":
                return "This person is harassing others and repeatetly broke the rules";
            case "modabuse":
                return "This person is repeatetly abusing the user reporting function with no reason";
            default:
                return "OOPS, Something went wrong...";
        }
    }
}