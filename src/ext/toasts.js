(function arc_ext_toasts(global, $) {

    const errorToast = '#Error_Toast',
        successToast = '#Success_Toast',
        primaryToast = '#Primary_Toast',
        toastWrapper = '#Toast_Wrapper';

    $(errorToast).toast({ delay: 5000 });
    $(successToast).toast({ delay: 5000 });
    $(primaryToast).toast({ autohide: false });

    $(errorToast).on('hidden.bs.toast', function() {
        $(toastWrapper).css("z-index", "-1")
    })

    $(successToast).on('hidden.bs.toast', function() {
        $(toastWrapper).css("z-index", "-1")
    })

    $(primaryToast).on('hidden.bs.toast', function() {
        $(toastWrapper).css("z-index", "-1")
    })

    global.showError = function showError(ttl, msg) {
        try {
            $(errorToast).find(".title").eq(0).html(ttl)
            $(errorToast).find(".body").eq(0).html(msg)
            $(errorToast).toast('show')
            $(toastWrapper).css("z-index", "3000")

            global.scrollTo(0);
        } catch (err) {
            console.log("ToastError >", err);
        }
    }

    global.showSuccess = function showSuccess(ttl, msg) {
        try {
            $(successToast).find(".title").eq(0).html(ttl)
            $(successToast).find(".body").eq(0).html(msg)
            $(successToast).toast('show');
            $(toastWrapper).css("z-index", "3000")

            global.scrollTo(0);
        } catch (err) {
            console.log("ToastError >", err);
        }
    }

    global.showPrimary = function showPrimary(ttl, msg) {
        try {
            $(primaryToast).find(".title").eq(0).html(ttl)
            $(primaryToast).find(".body").eq(0).html(msg)
            $(primaryToast).toast('show');
            $(toastWrapper).css("z-index", "3000")

            global.scrollTo(0);
        } catch (err) {
            console.log("ToastError >", err);
        }
    }

})(this, jQuery);