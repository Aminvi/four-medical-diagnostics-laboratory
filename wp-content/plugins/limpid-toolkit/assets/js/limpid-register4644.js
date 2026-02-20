(function ($) {
    'use strict';

    function scrollToFormTop($form) {
        if (!$form || !$form.length) {
            return;
        }

        var offset = $form.offset();
        if (!offset) {
            return;
        }

        $('html, body').animate({
            scrollTop: Math.max(offset.top - 120, 0)
        }, 300);
    }

    function handleResponse($form, response) {
        var $message = $form.find('.limpid-register-message');
        var successMessage = $form.data('success-message');
        var errorMessage = $form.data('error-message');

        $message.removeClass('is-error is-success');

        if (response && response.success) {
            var serverMessage = response.data && response.data.message ? response.data.message : successMessage;
            $message.addClass('is-success').text(serverMessage);

            var redirect = $form.data('redirect') || (response.data && response.data.redirect_url);
            if (redirect) {
                setTimeout(function () {
                    window.location.href = redirect;
                }, 600);
            }
        } else {
            var message = errorMessage;
            if (response && response.data && response.data.message) {
                message = response.data.message;
            }

            $message.addClass('is-error').text(message);
        }

        scrollToFormTop($form);
    }

    $(document).on('submit', '.limpid-register-form', function (event) {
        event.preventDefault();

        var $form = $(this);
        var $button = $form.find('button[type="submit"]');
        var $message = $form.find('.limpid-register-message');

        $.ajax({
            url: $form.data('ajax-url'),
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'limpid_user_register',
                nonce: $form.data('nonce'),
                full_name: $form.find('[name="full_name"]').val(),
                email: $form.find('[name="email"]').val(),
                phone: $form.find('[name="phone"]').val(),
                password: $form.find('[name="password"]').val(),
                password_confirm: $form.find('[name="password_confirm"]').val(),
                consent: $form.find('[name="consent"]').is(':checked') ? 1 : 0,
                redirect: $form.data('redirect') || ''
            },
            beforeSend: function () {
                $form.addClass('is-loading');
                $button.prop('disabled', true);
                $message.removeClass('is-error is-success').text('');
            }
        }).done(function (response) {
            handleResponse($form, response);
        }).fail(function (jqXHR) {
            var response = jqXHR && jqXHR.responseJSON ? jqXHR.responseJSON : null;

            if (!response && jqXHR && jqXHR.responseText) {
                try {
                    response = JSON.parse(jqXHR.responseText);
                } catch (error) {
                    response = null;
                }
            }

            handleResponse($form, response || { success: false });
        }).always(function () {
            $form.removeClass('is-loading');
            $button.prop('disabled', false);
        });
    });
})(jQuery);
