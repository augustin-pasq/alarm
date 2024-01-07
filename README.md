# Alarm

Provide your alarms to this API, get the remaining time before the next ring!

## Why?

Probably the first thing that people can wonder when they see this repository. So basically, I wake up every morning
thanks to an alarm on my smartphone. On my Samsung phone, the header of the clock application shows the time remaining
before the next alarm. But I bought an iPhone and I found that the clock application sucks; and one of the problems I
noticed is that if I want to know how much time it lasts before my alarm will ring I have to do mental arithmetic.
Too much effort for me.

So I wrote a Siri Shortcut and few lines of code to make a computer do this mental arithmetic for me!

## How to use it?

First, install this Siri Shortcut: https://www.icloud.com/shortcuts/da92b99bbe3b456b86ea73eddac95638.
This Shortcut gets all the enabled alarms from the clock application and sends it to the server.

Then, the server determines which one is the "closest" and computes the difference between now and the moment when the
alarm will ring. The result is returned to the Siri Shortcut, which will display it. If the Shortcut is called from a
Siri voice command, the result will be read.

TL;DR: Just run the shortcut, by yourself or with Siri.

## Disclaimer

The Siri Shortcut sends the days of the recurrence in the system language. My system language is set to French, and
because I wrote the code mainly for my personal purpose, it expects to get French days. It's probably something to
improve, but I'm too lazy for that, sorry not sorry?

## Author

Augustin Pasquier