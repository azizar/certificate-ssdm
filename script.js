jQuery(document).ready(function () {
  jQuery
    .ajax({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users',
    })
    .done(function (data) {
      const elements = [];
      jQuery.each(data, function (index, element) {
        let html = '';
        html +=
          '<div style="width: 30.33%; overflow: hidden; display: inline-block; max-width: 100%;">';
        html +=
          '<img src="" alt = "Image 1" style = "width: 100%; height: auto; object-fit: cover; display: inline-block; color: transparent; height: auto; font-size: 0; vertical-align: middle; max-width: 100%; image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: optimizeQuality; -ms-interpolation-mode: bicubic;"/>';
        html += '<div style="margin-top:16px;">';
        html +=
          '<h2 style = "font-size: 24px; font-weight: 600; font-style: normal; text-transform: uppercase;">Title 1</h2>';
        html += '<h3 style="margin: 0;">August 24, 2024</h3>';
        html += '</div>';
        html += '</div>';
        elements.push(html);
      });
      jQuery('#event_result').append(elements.join(''));
    });
});
