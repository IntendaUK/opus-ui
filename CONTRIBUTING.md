# Contributing to Opus UI

Opus UI is a platform built on React that rapidly accelerates application development. Through Opus UI, you can build components as data (JSON) then define complex interactions between components. 

The [Open Source Guides](https://opensource.guide/) website has a collection of resources for individuals, communities, and companies. These resources help people who want to learn how to run and contribute to open source projects. Contributors and people new to open source alike will find the following guides especially useful:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Building Welcoming Communities](https://opensource.guide/building-community/)

## Get involved

There are many ways to contribute to Opus UI, and many of them do not involve writing any code. Here's a few ideas to get started:

- Simply start using Opus UI. Go through the [Getting Started](https://opus-ui/learn) guide. Does everything work as expected? If not, we're always looking for improvements. Let us know by [opening an issue](#reporting-new-issues).
- Look through the [open issues](https://github.com/IntendaUK/opus-ui/issues). A good starting point would be issues tagged [good first issue](https://github.com/IntendaUK/opus-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). Provide workarounds, ask for clarification, or suggest labels. Help [triage issues](#triaging-issues-and-pull-requests).
- If you find an issue you would like to fix, [open a pull request](#pull-requests).
- Take a look at the [features requested](https://github.com/IntendaUK/opus-ui/labels/feature%20request) by others in the community and consider opening a pull request if you see something you want to work on.

Contributions are very welcome. If you think you need help planning your contribution, please ping us on Discord at [opus-ui.com/discord](http://opus-ui.com/discord) and let us know you are looking for a bit of help.

### Triaging issues and pull requests

One great way you can contribute to the project without writing any code is to help triage issues and pull requests as they come in.

- Ask for more information if you believe the issue does not provide all the details required to solve it.
- Flag issues that are stale or that should be closed.
- Ask for test plans and review code.

## Bugs

We use [GitHub issues](https://github.com/IntendaUK/opus-ui/issues) for our public bugs. If you would like to report a problem, take a look around and see if someone already opened an issue about it. If you are certain this is a new unreported bug, you can submit a [bug report](#reporting-new-issues).

If you have questions about using Opus UI, contact us on Discord at [opus-ui.com/discord](https://opus-ui.com/discord), and we will do our best to answer your questions.

If you see anything you'd like to be implemented, create a [feature request issue](https://github.com/IntendaUK/opus-ui/issues/new?template=feature_request.yml)

### Reporting new issues

When [opening a new issue](https://github.com/IntendaUK/opus-ui/issues/new/choose), always make sure to fill out the issue template. **This step is very important!** Not doing so may result in your issue not being managed in a timely fashion. Don't take this personally if this happens, and feel free to open a new issue once you've gathered all the information required by the template.

- **One issue, one bug:** Please report a single bug per issue.
- **Provide reproduction steps:** List all the steps necessary to reproduce the issue. The person reading your bug report should be able to follow these steps to reproduce your issue with minimal effort.

## Pull requests

### Proposing a change

If you would like to request a new feature or enhancement but are not yet thinking about opening a pull request, you can also file an issue with [feature template](https://github.com/IntendaUK/opus-ui/issues/new?template=feature_request.yml).

If you're only fixing a bug, it's fine to submit a pull request right away, but we still recommend that you file an issue detailing what you're fixing. This is helpful in case we don't accept that specific fix but want to keep track of the issue.

Small pull requests are much easier to review and more likely to get merged.

### Installation

Ensure you have [nodejs and npm](https://nodejs.org/en/download) installed. After cloning the repository, run `npm install`.

### Creating a branch

Fork [the repository](https://github.com/IntendaUK/opus-ui) and create your branch from `main`. If you've never sent a GitHub pull request before, you can learn how from [this free video series](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

### Testing



[Eslint](https://eslint.org) will catch most styling issues that may exist in your code. You can check the status of your code styling by simply running `npm lint`.

#### Code conventions

- `camelCase` for all variable names and methods.

### Sending your pull request

Please make sure the following is done when submitting a pull request:

1. Describe your **test plan** in your pull request description. Make sure to test your changes.
2. Make sure your code lints (`npm lint`).

All pull requests should be opened against the `main` branch. Make sure the PR does only one thing, otherwise please split it. Do not bump the version in any way in your PR. For now, we will take care of versioning manually after a PR is accepted. This will definitely change in the future.

#### Breaking changes

When adding a new breaking change, follow this template in your pull request:

```md
### New breaking change here

- **Who does this affect**:
- **How to migrate**:
- **Why make this breaking change**:
- **Severity (number of people affected x effort)**:
```

## License

By contributing to Opus UI, you agree that your contributions will be licensed under its [AGPLv3 license](https://github.com/IntendaUK/opus-ui/blob/main/LICENSE).

## Questions

Feel free to ask in [#contributing](https://discord.com/channels/1212306369198170112/1212755342757462056) on [Discord](http://opus-ui.com/discord) if you have questions about our process, how to proceed, etc.
