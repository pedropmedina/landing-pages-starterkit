(() => {
  // sprout API will only work once we deploy to Hubspot server
  const player = new SV.Player({ videoId: 'd39cd8b51c1de7c25a' });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //                            Countdown
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // The data/time we want to countdown to
  const countDownDate = new Date('Jul 17, 2020 18:00:00').getTime();

  const interval = setInterval(function () {
    const now = new Date().getTime();
    const timeleft = countDownDate - now;

    // Calculating the days, hours, minutes and seconds left
    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    // Result is output to the specific element
    document.getElementById('days_time').innerHTML = days + ' days :';
    document.getElementById('hours_time').innerHTML = hours + ' hours :';
    document.getElementById('minutes_time').innerHTML = minutes + ' minutes :';
    document.getElementById('seconds_time').innerHTML = seconds + ' seconds ';

    // Display the message when countdown is over
    if (timeleft < 0) {
      clearInterval(interval);
      document.getElementById('days_time').innerHTML = '';
      document.getElementById('hours_time').innerHTML = '';
      document.getElementById('minutes_time').innerHTML = '';
      document.getElementById('seconds_time').innerHTML = '';
      document.getElementById('end_time').innerHTML = 'TIME UP!!';
    }
  }, 1000);

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //                            Modal
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const showModal = (id, player) => {
    return () => {
      if (id === '#modal-video') player.play(); // start video on opening modal

      document.querySelector(id).classList.remove('hidden');
      const scrollY = document.documentElement.style.getPropertyValue(
        '--scroll-y'
      );
      const body = document.body;
      body.style.top = `-${scrollY}`;
      body.classList.add('fixed', 'w-full');
    };
  };

  const closeModal = (id, player) => {
    return () => {
      if (id === '#modal-video') player.pause(); // start video on opening modal

      const body = document.body;
      const scrollY = body.style.top;
      body.style.top = '';
      body.classList.remove('fixed');
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      document.querySelector(id).classList.add('hidden');
    };
  };

  window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty(
      '--scroll-y',
      `${window.scrollY}px`
    );
  });

  const handleModal = (cls) => (fn) =>
    document
      .querySelectorAll(cls)
      .forEach((el) => el.addEventListener('click', fn));

  handleModal('.modal-show-form')(showModal('#modal-form', player));
  handleModal('.modal-close-form')(closeModal('#modal-form', player));
  handleModal('.modal-show-video')(showModal('#modal-video', player));
  handleModal('.modal-close-video')(closeModal('#modal-video', player));

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //                            Accordion
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const handleAccordion = (el, index) => {
    const element = document.getElementById('answer-' + index);
    const symbol = document.getElementById('symbol-' + index);

    if (element.offsetParent == null) {
      element.classList.remove('hidden');
      symbol.innerHTML = '<i class="fas fa-minus-circle"></i>';
      el.classList.remove('border-b-2', 'border-white');
    } else {
      element.classList.add('hidden');
      el.classList.add('border-b-2', 'border-white');
      symbol.innerHTML = '<i class="fas fa-plus-circle"></i>';
    }
  };

  const accordions = document.querySelectorAll('.accordion-wrapper');
  accordions.forEach((el, index) =>
    el.addEventListener('click', () => handleAccordion(el, index))
  );
})();
