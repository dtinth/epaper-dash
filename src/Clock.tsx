import { now } from "./now.ts";

const weekdayFormat = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const dayFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
});

export function Clock() {
  const date = now.value;
  const time = (
    <>
      {String(date.getHours()).padStart(2, "0")}
      <span class="clock-colon">:</span>
      {String(date.getMinutes()).padStart(2, "0")}
    </>
  );

  return (
    <>
      <div class="clock">
        <div class="clock-face-shadow">{time}</div>
        <div class="clock-face">{time}</div>
      </div>
      <div class="clock-date">
        <div>
          <div>{weekdayFormat.format(date)}</div>
          <div>{dayFormat.format(date)}</div>
        </div>
      </div>
    </>
  );
}
