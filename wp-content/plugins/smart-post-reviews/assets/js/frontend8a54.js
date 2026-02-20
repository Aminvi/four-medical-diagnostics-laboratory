(function () {
    if ( 'undefined' === typeof window || 'undefined' === typeof document ) {
        return;
    }

    function hasSubmissionMessage(config) {
        if ( config && true === config.hasMessage ) {
            return true;
        }

        if ( 'undefined' !== typeof URLSearchParams ) {
            var params = new URLSearchParams( window.location.search );
            if ( params.has( 'spr_message' ) ) {
                return true;
            }
        }

        return false;
    }

    function getTargetElement(config) {
        var targetSelector = config && config.target ? config.target : null;
        var target = null;

        if ( targetSelector ) {
            try {
                target = document.querySelector( targetSelector );
            } catch ( error ) {
                target = null;
            }
        }

        if ( ! target ) {
            target = document.querySelector( '.spr-review-form' );
        }

        return target;
    }

    document.addEventListener( 'DOMContentLoaded', function () {
        var config = window.SPRReviews || {};

        if ( ! hasSubmissionMessage( config ) ) {
            return;
        }

        var target = getTargetElement( config );

        if ( ! target ) {
            return;
        }

        window.requestAnimationFrame( function () {
            target.scrollIntoView( { behavior: 'smooth', block: 'start' } );
        } );
    } );
})();
