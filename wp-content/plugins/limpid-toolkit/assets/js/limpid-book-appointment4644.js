(function ($) {
    'use strict';

    function getSlotSelect($form) {
        return $form.find('select[name="slot_start"]');
    }

    function resetSlots($form, message) {
        var $slotSelect = getSlotSelect($form);
        var placeholder = message || $form.data('slot-placeholder') || '--';
        $slotSelect.empty()
            .append($('<option>', {
                text: placeholder,
                value: '',
                disabled: true,
                selected: true
            }))
            .prop('disabled', true);
        $form.find('input[name="slot_end"]').val('');
    }

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
        var $message = $form.find('.limpid-book-appointment-message');
        $message.removeClass('is-error is-success is-info');

        if (!message) {
            $message.text('');
            return;
        }

        $message.addClass(type || 'is-info').text(message);
        scrollToFormTop($form);
    }

    function fetchSlots($form) {
        var doctorId = $form.find('select[name="doctor_id"]').val();
        var date = $form.find('input[name="appointment_date"]').val();
        var nonce = $form.data('slots-nonce');
        var action = $form.data('slots-action');
        var loadingMessage = $form.data('loading-message');

        if (!doctorId || !date) {
            resetSlots($form);
            return;
        }

        resetSlots($form, loadingMessage || 'Loading slots...');
        setMessage($form, loadingMessage || 'Loading available slots...', 'is-info');

        $.ajax({
            url: $form.data('ajax-url'),
            type: 'POST',
            dataType: 'json',
            data: {
                action: action,
                nonce: nonce,
                doctor_id: doctorId,
                date: date
            }
        }).done(function (response) {
            var $slotSelect = getSlotSelect($form);
            $slotSelect.empty();

            if (!response || !response.success || !response.data || !response.data.slots || !response.data.slots.length) {
                var emptyMessage = $form.data('empty-slots-message');
                resetSlots($form, emptyMessage || 'No slots available');
                setMessage($form, emptyMessage || 'No slots available for that day.', 'is-error');
                return;
            }

            $slotSelect.append($('<option>', {
                text: $form.data('slot-placeholder') || 'Select a time',
                value: '',
                disabled: true,
                selected: true
            }));

            $.each(response.data.slots, function (index, slot) {
                var label = slot.label;
                if (slot.capacity_remaining && slot.capacity_remaining > 1) {
                    label += ' (' + slot.capacity_remaining + ' left)';
                }

                var $option = $('<option>', {
                    text: label,
                    value: slot.start
                });

                $option.attr('data-end', slot.end);
                $slotSelect.append($option);
            });

            $slotSelect.prop('disabled', false);
            setMessage($form, '', '');
        }).fail(function () {
            var errorMessage = $form.data('error-message') || 'Unable to load slots. Please try again.';
            resetSlots($form, errorMessage);
            setMessage($form, errorMessage, 'is-error');
        });
    }

    function collectBookingPayload($form) {
        var $selectedSlot = getSlotSelect($form).find('option:selected');

        return {
            action: $form.data('book-action'),
            nonce: $form.data('book-nonce'),
            doctor_id: $form.find('select[name="doctor_id"]').val(),
            appointment_date: $form.find('input[name="appointment_date"]').val(),
            slot_start: $selectedSlot.val(),
            slot_end: $selectedSlot.data('end') || '',
            visit_type: $form.find('select[name="visit_type"]').val(),
            patient_name: $form.find('input[name="patient_name"]').val(),
            patient_email: $form.find('input[name="patient_email"]').val(),
            patient_phone: $form.find('input[name="patient_phone"]').val(),
            notes: $form.find('textarea[name="notes"]').val(),
            consent: $form.find('input[name="consent"]').is(':checked') ? 1 : 0
        };
    }

    function handleBookingResponse($form, response) {
        if (response && response.success) {
            var successMessage = response.data && response.data.message ? response.data.message : $form.data('success-message');
            setMessage($form, successMessage || 'Appointment booked successfully.', 'is-success');
            $form[0].reset();
            resetSlots($form);
        } else {
            var errorMessage = $form.data('error-message') || 'Unable to book appointment. Please try again.';
            if (response && response.data && response.data.message) {
                errorMessage = response.data.message;
            }
            setMessage($form, errorMessage, 'is-error');
            fetchSlots($form);
        }
    }

    $(document).on('change', '.limpid-book-appointment-form select[name="doctor_id"], .limpid-book-appointment-form input[name="appointment_date"]', function () {
        var $form = $(this).closest('.limpid-book-appointment-form');
        fetchSlots($form);
    });

    $(document).on('change', '.limpid-book-appointment-form select[name="slot_start"]', function () {
        var $option = $(this).find('option:selected');
        var $form = $(this).closest('.limpid-book-appointment-form');
        $form.find('input[name="slot_end"]').val($option.data('end') || '');
    });

    $(document).on('submit', '.limpid-book-appointment-form', function (event) {
        event.preventDefault();
        var $form = $(this);
        var $button = $form.find('button[type="submit"]');
        var payload = collectBookingPayload($form);

        if (!payload.slot_start || !payload.slot_end) {
            setMessage($form, $form.data('slot-required-message') || 'Please choose a time slot.', 'is-error');
            return;
        }

        $form.addClass('is-loading');
        $button.prop('disabled', true);
        setMessage($form, $form.data('submitting-message') || 'Booking your appointment...', 'is-info');

        $.ajax({
            url: $form.data('ajax-url'),
            type: 'POST',
            dataType: 'json',
            data: payload
        }).done(function (response) {
            handleBookingResponse($form, response);
        }).fail(function (jqXHR) {
            var response = jqXHR && jqXHR.responseJSON ? jqXHR.responseJSON : null;
            handleBookingResponse($form, response || { success: false });
        }).always(function () {
            $form.removeClass('is-loading');
            $button.prop('disabled', false);
        });
    });
})(jQuery);
