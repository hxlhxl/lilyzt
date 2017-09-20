(function(factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'],function($) {
            return factory($,window,document);
        })
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = function(root,$) {
            if (!root) {
                // CommonJS environments without a window global must pass a root
                root = window;
            }
            if (!$) {
                $ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
                    require('jquery') :
                    require('jquery')( root );
            }
            return factory($,root,root.document);
        }
    } else {
        // browser
        factory(jQuery,window,document);
    }
}
(function($,window,document,undefined) {
    "use strict";
    var TinyTable = function(options) {
        this.$ = function(sSelector,oOpts) {
                     return this.api(true).$(sSelector,oOpts);
                 }
    }
    $.fn.tinyTable = TinyTable;
    TinyTable.$ = $;
    TinyTable.myvar = "abcdefg";
    return $.fn.tinyTable;
})
)
