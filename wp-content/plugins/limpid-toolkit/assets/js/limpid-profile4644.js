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

    function setMessage($form, message, type) {
        var $message = $form.find('.limpid-profile-settings-message');
        $message.removeClass('is-error is-success is-info');

        if (!message) {
            $message.text('');
            return;
        }

        $message.addClass(type || 'is-info').text(message);
        scrollToFormTop($form);
    }

    $(document).on('submit', '.limpid-profile-settings-form', function (event) {
        event.preventDefault();

        var $form = $(this);
        var $button = $form.find('button[type="submit"]');

        var payload = {
            action: $form.data('action'),
            nonce: $form.data('nonce'),
            display_name: $form.find('input[name="display_name"]').val(),
            phone: $form.find('input[name="phone"]').val()
        };

        $form.addClass('is-loading');
        $button.prop('disabled', true);
        setMessage($form, $form.data('processing-message') || 'Saving your changes...', 'is-info');

        $.ajax({
            url: $form.data('ajax-url'),
            type: 'POST',
            dataType: 'json',
            data: payload
        }).done(function (response) {
            if (response && response.success) {
                var message = response.data && response.data.message ? response.data.message : $form.data('success-message');
                setMessage($form, message || 'Profile updated successfully.', 'is-success');
            } else {
                var errorMessage = $form.data('error-message') || 'Unable to update profile. Please try again.';
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message;
                }
                setMessage($form, errorMessage, 'is-error');
            }
        }).fail(function (jqXHR) {
            var response = jqXHR && jqXHR.responseJSON ? jqXHR.responseJSON : null;
            var errorMessage = $form.data('error-message') || 'Unable to update profile. Please try again.';
            if (response && response.data && response.data.message) {
                errorMessage = response.data.message;
            }
            setMessage($form, errorMessage, 'is-error');
        }).always(function () {
            $form.removeClass('is-loading');
            $button.prop('disabled', false);
        });
    });
})(jQuery);
