var ajaxcart = {
	g: new Growler(),
	initialize: function() {
		this.g = new Growler();		
		this.bindEvents();
	},
	bindEvents: function () {
		this.addSubmitEvent();

		$$('a[href*="/checkout/cart/delete/"]').each(function(e){
			$(e).observe('click', function(event){
				setLocation($(e).readAttribute('href'));
				Event.stop(event);
			});
		});
	},
	ajaxCartSubmit: function (obj) {
		var _this = this;

		try {
			if(typeof obj == 'string') {
				var url = obj;

				new Ajax.Request(url, {
                    onCreate	: function() {
						_this.g.warn("Processing", {life: 5});
					},
					onSuccess	: function(response) {
						// Handle the response content...
						try{
						    var res = response.responseText.evalJSON();
                            if(res) {
								if(res.r == 'success') {
									if(res.message) {
										_this.showSuccess(res.message);
									} else {
										_this.showSuccess('Item was added into cart.');
									}

                                    //update all blocks here
                                    _this.updateBlocks(res.update_blocks);

								} else {
                                    if(typeof res.messages != 'undefined') {
                                        _this.showError(res.messages);
                                    } else {
                                        _this.showError("Something bad happened");
                                    }
								}
							} else {
								document.location.reload(true);
							}
						} catch(e) {
							//window.location.href = url;
                            document.location.reload(true);
						}
					}
				});
			} else {
				var url	 = 	obj.form.action,
					data =	obj.form.serialize();

             	new Ajax.Request(url, {
					method		: 'post',
					postBody	: data,
					onCreate	: function() {
						_this.g.warn("Processing", {life: 5});
					},
					onSuccess	: function(response) {
						// Handle the response content...
						try{
						    var res = response.responseText.evalJSON();
						    
						    if(res) {
								if(res.r == 'success') {
								    if(res.message) {
										_this.showSuccess(res.message);
									} else {
										_this.showSuccess('Item was added into cart.');
									}

                                    //update all blocks here
                                    _this.updateBlocks(res.update_blocks);

								} else {
									if(typeof res.messages != 'undefined') {
										_this.showError(res.messages);
									} else {
										_this.showError("Something bad happened");
									}
								}
							} else {
								_this.showError("Something bad happened");
							}
						} catch(e) {
							console.log(e);
							_this.showError("Something bad happened");
						}
					}
				});
			}
		} catch(e) {
			console.log(e);
			if(typeof obj == 'string') {
				window.location.href = obj;
			} else {
				document.location.reload(true);
			}
		}
	},

	showSuccess: function(message) {
		this.g.info(message, {life: 5});
	},

	showError: function (error) {
		var _this = this;

		if(typeof error == 'string') {
			_this.g.error(error, {life: 5});
		} else {
			error.each(function(message){
				_this.g.error(message, {life: 5});
			});
		}
	},

    addSubmitEvent: function () {

		if(typeof productAddToCartForm != 'undefined') {
			var _this = this;
			productAddToCartForm.submit = function(url){
			    if(this.validator && this.validator.validate()){
			    	_this.ajaxCartSubmit(this);
			    }
			    return false;
			}

			productAddToCartForm.form.onsubmit = function() {
			    productAddToCartForm.submit();
			    return false;
			};
		}
	},

    updateBlocks: function(blocks) {
        var _this = this;

        if(blocks) {
            try{
                blocks.each(function(block){
                    if(block.key) {
                        var dom_selector = block.key;
                        if($$(dom_selector)) {
                            $$(dom_selector).each(function(e){$(e).replace(block.value);});
                        }
                    }
                });
                _this.bindEvents();
            } catch(e) {console.log(e);}
        }

    }

};

var oldSetLocation = setLocation;
var setLocation = (function() {
	return function(url){
        if( url.search('checkout/cart/add') != -1 ) {
			ajaxcart.ajaxCartSubmit(url);
		} else if( url.search('checkout/cart/delete') != -1 ) {
			ajaxcart.ajaxCartSubmit(url);
		} else {
			oldSetLocation(url);
		}
    };
})();

document.observe("dom:loaded", function() {
	ajaxcart.initialize();
});