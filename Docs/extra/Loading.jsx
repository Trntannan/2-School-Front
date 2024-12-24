import React from "react";

const Loading = () => (
  <button type="button" class="bg-indigo-500 ..." disabled>
    <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path class="opacity-75" fill="currentColor"></path>
    </svg>
    Processing...
  </button>
);

export default Loading;
