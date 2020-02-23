const Nav = function() {
    
    const navigate = function(word) {
        $('.section').slideUp();
        $(`#${word}`).slideDown();
    }

    return {
        navigate : navigate
    }

}();