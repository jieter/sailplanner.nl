# Sailplanner - The anticipatory pleasure.

<a href="images/2011-02-06-sailplanner-screenshot.png" title="Screenshot of an early version"><img src="/images/2011-02-06-sailplanner-screenshot.png" style="width: 40%; float: right;" /></a>

Sailplanner is a side project made by [Jieter](https://twitter.com/Jietermanis),
to explore the feasability of sailing trips, originally created in 2011 using Google Maps.
I used to plan trips using Googles 'My maps' feature, along with a spreadsheet to calculate sailing distances.

After becoming a Leaflet user, I intended to use it to rewrite sailplanner to not depend on Google anymore, but I did not actually do it until more than two years after Google introduced new billing rules for Google Maps.

When I finally had some time, I wanted to get some experience with [Svelte](https://svelte.dev/), so the current version of Sailplanner is build on that.

The sourcecode for the sailplanner UI can be found at Github: https://github.com/jieter/sailplanner.nl

### Changelog
 - 2020-09-01 - Re-implemented the UI using [Svelte](https://svelte.dev/)
 - 2018-09-21 - Added note about 'for development purposes only' due to the google maps API being not free anymore.
 - 2016-04-14 - Added OpenSeaMap as overlay layer.
 - 2011-06-29 - Added non-blocking alerts, a little quick-start story, copy-button, FAQ
 - 2011-06-15 - Added KML &amp; GPX export. Validated with feedvalidator.org / xmllint.



### Anticipated/frequently asked questions

> I lost my edit-url. Can you provide me with a new one?

No, but you can use the copy button to copy the planner and save it to the server again. You'll receive a new edit url. Don't loose it this time!

> Can I login and manage my planners?

Maybe sometime in the future.

> Sailplanner does not work for me... Whats wrong?

Sailplanner is still under development.
I'm trying hard to provide a bug-free website online, but every now and then it might be broken for a while.

You can help me by [reporting issues](https://github.com/jieter/sailplanner.nl/issues), or open a pull request.

> Can I have your source-code?

Yes, it is available at https://github.com/jieter/sailplanner.nl

> Why is Sailplanner not save for navigation?

First of all, these online maps are not a replacement of a proper chart.
Lots of details are available, but there is no data about depth, marks and dangers.
While OpenSeaMap provides some of this, no guarantee is made about the correctness of the data in these charts.
