---
layout: page
title: Templates
nav_order: 4
path: /usage/templates
group: Modeling
---

## Using Templates

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) supports templates that allow you to
quickly create new threat models based on pre-defined structures.

**Note**: The template feature is currently only available for GitHub repositories
and local users (if they have templates in the local file system).
Support for Atlassian Bitbucket, GitLab, Google Drive and desktop is not yet implemented.

## Create a new model from a template

### Using the Web application

![Login image]({{ '/assets/images/login.png' | relative_url }}){: .float-right }

The Threat Dragon web application can be configured with organization-wide templates stored in a
GitHub repository. Templates provide pre-defined threat model structures that help teams get started
quickly with consistent patterns.
When using templates, you will need to be logged in to your repository provider (e.g., GitHub)
to access the template gallery and save new models created from templates.

To create a new threat model from a template access the welcome page and access template gallery by
clicking on the **Create model from a Template** button on the Welcome page.

![New model image]({{ '/assets/images/template-button.png' | relative_url }}){: .float-right }

You will then be presented with the Template Gallery showing available templates.
Browse or search for a template that fits your needs, then click on the template card to select it.

After selecting a template, you will be presented with a list of your repositories.
Pick the one where you want to store your new model.
If you have more than 30 repos you might have to page through them until you find the one you want.

Once you have picked your target repo, you will be asked to pick a branch.
Again, if you have more than 30 branches you might need to page through.

When you pick a branch you will be taken to the threat model edit page
where you can enter general information about your model.
The template's diagrams, components, and threats will already be populated as a starting point.
The name that you provide for the model will be used as the file name within the repository.

## Loading a template from local file

![Local template image]({{ '/assets/images/local-template.png' | relative_url }}){: .float-right }

In addition to organization templates, you can also use a local threat model file as a template.
This is useful when you have received a template file from a colleague or want to use
an existing model as a starting point for a new one.

From the Template Gallery, click **Import from Local** to browse for a template file
on your local filesystem.

The file will be validated to ensure it's a properly formatted Threat Dragon template (metadata + model content).
Once loaded, you can select your target repository and branch just like with organization templates.
The imported model's diagrams, components, and threats will be used as your starting point.

**Note**: This creates a new model based on the local file - it does not add the template
to your organization's template repository. Only administrators can add templates to
the shared template gallery.

## Exporting an existing model as a template

![Export template image]({{ '/assets/images/export-template.png' | relative_url }}){: .float-right }

If you have created a threat model that would be useful as a template for others,
you can export it as a template file that can be shared or imported later.

From your threat model's details page, click on the manage dropdown and select **Export as Template** button.
You will be taken to the export template page where you can review and customize the
template details.

On the export template page, you can:

* Review the template name and description
* Add or modify tags for easier searching

Once you are satisfied with the template details, click **Save Template** to download the
template file to your local filesystem.

The exported template file can then be:

* Shared with colleagues who can import it locally using **Import from Local**
* Sent to administrators to be added to the organization's template repository
* Used as a backup or starting point for future models

**Note**: The export removes any organization-specific information (like repository paths)
and generates new unique identifiers, making it suitable for use as a reusable template.

## Managing Templates (Administrators)

![Manage Templates]({{ '/assets/images/manage-template.png' | relative_url }}){: .float-right }

Users with **push** or **admin** permissions on the template repository (`GITHUB_CONTENT_REPO`)
are considered administrators and can manage the organization's shared template gallery.

Administrators will see a **cog icon** in the  navigation bar.
Clicking the cog reveals a dropdown menu with a **Manage Templates** button,
which directs to manage templates page that allows to perform crud operations on templates.

For information on configuring the template repository, see the
[GitHub configuration guide]({{ '/configure/github.html#template-repository-configuration' | relative_url }}).

### Bootstrapping the Template Repository

![Manage Templates]({{ '/assets/images/initialise-templates.png' | relative_url }}){: .float-right }

Before templates can be used, an administrator must initialize the template repository structure.
This creates the necessary folders and metadata files.

1. Log in to Threat Dragon with an account that has admin access to the template repository
2. Navigate to the Manage Templates
3. Click the **Initialise** button (only visible to administrators)
4. Confirm the initialization

This creates the `templates/` directory and `template_info.json` metadata file in the repository.
Bootstrapping only needs to be done once per repository.

### Importing Templates to the Organization

Administrators can add templates to the shared gallery so all users can access them.

1. Obtain a template file (either exported from an existing model or received from a colleague)
2. Navigate to the Manage Templates
3. Click **Add New Template** button (only visible to administrators)
4. Select the template file from your local filesystem

The template will now appear in the Template Gallery for all users.

### Updating Template Metadata

Administrators can update a template's name, description, or tags without modifying the template content.

1. Navigate to the Manage Templates
2. Find the template you want to update
3. Click the burger menu on the template card and click on edit
4. Modify the name, description, or tags as needed

### Deleting Templates

Administrators can remove templates from the organization gallery.

1. Navigate to the Manage Templates
2. Find the template you want to delete
3. Click the burger menu on the template card and click on **delete**
4. Confirm the deletion

**Warning**: Deleting a template cannot be undone. Existing threat models created from the template
are not affected, but the template will no longer be available for creating new models.

**Session timeout** : when logging in to an external drive or repository, be aware that sessions can time out.
This timeout length can be different according to the repository / drive provider;
if this is a problem then ensure the session is kept alive using a tab in the same browser window.
