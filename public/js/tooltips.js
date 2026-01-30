function createTooltip(target, tooltip, position = "top") {
  const popperInstance = Popper.createPopper(target, tooltip, {
    placement: position,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 20]
        }
      }
    ]
  });

  function show() {
    // Make the tooltip visible
    tooltip.setAttribute('data-show', '');

    // Enable the event listeners
    popperInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: true },
      ],
    }));

    // Update its position
    popperInstance.update();
  }

  function hide() {
    // Hide the tooltip
    tooltip.removeAttribute('data-show');

    // Disable the event listeners
    popperInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));
  }

  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach((event) => {
    target.addEventListener(event, show);
  });

  hideEvents.forEach((event) => {
    target.addEventListener(event, hide);
  });

  return popperInstance;
}
