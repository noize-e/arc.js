(function arc_ext_paypal(global) {

    var PayPal = {
        render: function(amount) {
            paypal.Buttons({

                /**
                 * [createOrder description]
                 * @param  {[type]} data    [description]
                 * @param  {[type]} actions [description]
                 * @return {[type]}         [description]
                 */
                createOrder: function createOrder(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount
                            }
                        }]
                    });
                },

                /**
                 * [onApprove description]
                 * @param  {[type]} data    [description]
                 * @param  {[type]} actions [description]
                 * @return {[type]}         [description]
                 */
                onApprove: function onApprove(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Transaction completed by ' + details.payer.name.given_name);
                        // Call your server to save the transaction
                        return fetch('/paypal-transaction-complete', {
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                orderID: data.orderID
                            })
                        });
                    });
                }
            }).render('#paypal-button-container');
        }
    }

    global.PayPal = PayPal;

})(this);