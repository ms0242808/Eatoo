//Quick View

$(document).ready(function () {
  $.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function() {
    quickView();
  });
});

function quickView() {
  $(".quick-view").click(function () {
    console.log("-----------");
    if ($('#quick-view').length == 0){$("body").append('<div id="quick-view"></div>');}
    var product_handle = $(this).data('handle');
    $('#quick-view').addClass(product_handle);
    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
      var title = product.title;
      var type = product.type;
      var price = 0;
      var original_price = 0;
      var desc = product.description;
      var images = product.images;
      var variants = product.variants;
      var options = product.options;
      var url = '/products/' + product_handle;
      var abc = window.location.pathname+"/"+product_handle;
      console.log(abc);

      $('.qv-product-title').text(title);
      $('.qv-product-type').text(type);
      $('.qv-product-description').html(desc);
      $('.view-product').attr('href', url);
      var imageCount = $(images).length;
      $(images).each(function (i, image) {
        if (i == imageCount - 1) {
          var image_embed = '<div><img src="' + image + '"></div>';
          image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
          $('.qv-product-images').append(image_embed);

          $('.qv-product-images').slick({
            'dots': true,
            'arrows': false,
            'respondTo': 'min',
            'useTransform': true
          }).css('opacity', '1');

        } else {
          image_embed = '<div><img src="' + image + '"></div>';
          image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
          $('.qv-product-images').append(image_embed);
        }
      });
      $(options).each(function (i, option) {console.log("option: "+product_handle);
        var opt = option.name;
        var selectClass = '.option.' + opt.toLowerCase();
        $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><select class="option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');
        $(option.values).each(function (i, value) {
          $('.option').append('<option value="' + value + '">' + value + '</option>');

        });
      });

      $(product.variants).each(function (i, v) {
        if (v.inventory_quantity == 0) {
          $('.qv-add-button').prop('disabled', true).val('Sold Out');
          $('.qv-add-to-cart').hide();
          $('.qv-product-price').text('Sold Out').show();
          return true
        } else {
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
          $('.qv-product-price').text('£' + price);
          if (original_price > 0) {
            $('.qv-product-original-price').text('£' + original_price).show();
          } else {
            $('.qv-product-original-price').hide();
          }
          $('select.option-0').val(v.option1);
          $('select.option-1').val(v.option2);
          $('select.option-2').val(v.option3);
          return false
        }
      });
    });

    $(document).on("change", "#quick-view select", function () {
      var selectedOptions = '';
      var var_id = '';
      //console.log("change: "+product_handle + "  " + $(this).val() );
      //console.log("Handle data: "+$(this).val());
      //console.log("4 "+product_handle);
      $('#quick-view select').each(function (i) {
        if (selectedOptions == '') {
          selectedOptions = $(this).val();
        } else {
          selectedOptions = selectedOptions + ' / ' + $(this).val();
        }
      });
      jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
        $(product.variants).each(function (i, v) {
          if (v.title == selectedOptions) {
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;
            var_id = v.id;
            $('#quick-view select').each(function (i, details) {
              console.log(product_handle+ " _ "+v.title);
              $('.description' ).css('display', 'none');
              $('#' + var_id).css('display', 'block');
            });
            $('.qv-product-price').text('£' + price);
            $('.qv-product-original-price').text('£' + original_price);
            if (v_inv == null) {
              $('.qv-add-button').prop('disabled', false).val('Add to Cart');
            } else {
              if (v.inventory_quantity < 1) {
                $('.qv-add-button').prop('disabled', true).val('Sold Out');
              } else {
                $('.qv-add-button').prop('disabled', false).val('Add to Cart');
              }
            }
          }
        });
      });
    });
    $.fancybox({
      href: '#quick-view',
      maxWidth: 1040,
      maxHeight: 600,
      fitToView: true,
      preload: 4,
      width: '75%',
      height: '70%',
      autoSize: false,
      closeClick: false,
      openEffect: 'none',
      closeEffect: 'none',
      'beforeLoad': function () {
        //var product_handle = $('#quick-view').attr('class');
        $(document).on("click", ".qv-add-button", function () {
          var qty = $('.qv-quantity').val();
          var selectedOptions = '';
          var var_id = '';
          $('#quick-view select').each(function (i) {
            if (selectedOptions == '') {
              selectedOptions = $(this).val();
            } else {
              selectedOptions = selectedOptions + ' / ' + $(this).val();
            }
          });
          jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
            $(product.variants).each(function (i, v) {
              if (v.title == selectedOptions) {
                var_id = v.id;
                console.log("Add: "+product_handle);
                processCart();
              }
            });
          });
          function processCart() {
            jQuery.post('/cart/add.js', {
              quantity: qty,
              id: var_id
            },
                        null,
                        "json"
                       ).done(function () {
                        upadteCartCount();
              $('.qv-add-to-cart-response').addClass('success').html('<span>' + $('.qv-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
              console.log("Added: "+product_handle + " option: "+selectedOptions);
              product_handle = [];
              selectedOptions = '';
              console.log("Clear add: "+product_handle + " option: "+ selectedOptions);
            })
            .fail(function ($xhr) {
              var data = $xhr.responseJSON;
              $('.qv-add-to-cart-response').addClass('error').html('<span><b>ERROR: </b>' + data.description);
            });
          }
          console.log(product_handle + ": Selected options " + selectedOptions);
        });
        function upadteCartCount() {
          jQuery.getJSON('/cart.js', function(cart){
            $('.cart-link__count--visible').html(cart.item_count);
          });
        }
        
        $('.fancybox-wrap').css('overflow', 'hidden !important');
      },
      'beforeShow': function () {
        $('#quick-view').hide().html(content).css('opacity', '1').fadeIn(function () {
          $('.qv-product-images').addClass('loaded');
        });
      },
      'afterClose': function () {
        $('#quick-view').removeAttr('class');
        $('#quick-view').removeClass().empty();
        console.log("close: "+product_handle);
        product_handle =[];
        console.log("Close remove: "+product_handle);
      }
    });
  });
};

$(window).resize(function () {
  if ($('#quick-view').is(':visible')) {
    $('.qv-product-images').slick('setPosition');
  }
});