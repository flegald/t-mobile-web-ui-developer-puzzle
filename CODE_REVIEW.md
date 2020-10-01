#Code Review
* Modify the file structure of the `data-access` directory
    * Move `data-access` into its own lib under `/libs` out of the `books` lib.
    * Create 2 directories, replacing the `+state` directory called `books` and `reading-list` and insert the corresponding file into the directories
    * *Why?*
        * The state management is hard to find. This will allow the code to be easier to find and understand.
        * There will be more precise imports into components.
        * The `data-access` lib will be more easily extended, especially if state functionality is added that does not relate to books in the future.

  
* Implement Pre-Commit line enforcing hooks ([Husky](https://github.com/typicode/husky), etc)
    * *Why*
        * This will prevent non standardized code to enter the repository and prevent such errors as found in `books.service.ts` - `Missing serach term`
        * This also benefits site security by ensuring no exploitative console logs or debuggers enter the site unnoticed.
  
        
* Consider modifying how routes are declared.
    * Create a Route Module where all routes are gathered.
    * *Why*
        * In its current implementation it can be somewhat difficult to find which route will direct to which component. Having all the routes in a singular location will make modifying and adding new components and routes much easier.
      
* Implement localization
    * Utilize i18n to add localization to the application.
    * *Why*
        * This will allow the application to be inclusive to many more people.
#Accessibility

### Lighthouse Report
* Buttons do not have an accessible name.
    * Added aria-label tag to search button
* Background and foreground colors do not have a sufficient contrast ratio.
    * Altered "Reading List" toggle button CSS to pass contrast tests.
    * Darkened "empty" text in no search results page.


### Manual
* `Try searching for a topic, for example "JavaScript`." text not accessible by keyboard ("JavaScript" word should be "clickable" with keyboard)
    * Added tab index and enter keydown even handler
* Label missing from search text input.
    * Added aria label to text field search input
* Images missing "alt" attribute.
    * Added alt label to book covers in search results, and separate alt label to books in reading list.
