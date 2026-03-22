---
layout: page
title: Template
nav_order: 4
path: /usage/templates
group: Modeling
---

## Using Templates

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) supports templates that allow you to
quickly create new threat models based on pre-defined structures.

**Note**: The template feature is currently available for GitHub repositories and for local users
who have templates stored in their local file system. Support for Atlassian Bitbucket, GitLab, Google Drive,
is coming in future releases.

## Create a new model from a template

### Using the Web application

The Threat Dragon web application can be configured with organisation-wide templates stored in a
GitHub repository. Templates provide pre-defined threat model structures that help teams get started
quickly with consistent patterns.

![Template button image]({{ '/assets/images/template-button.png'
| relative_url }}){: .float-right style="max-width: 170px; width: 100%;" }

When using templates, you will need to be authenticated using the OAuth app from your repository
provider (GitHub only for now) to access the template gallery and save new models created from templates.

To create a new threat model from a template, go to the Welcome page and click the
**Create model from a Template** button.

You will then be presented with the Template Gallery showing all available templates.
Browse or search for a template that fits your needs, then click on the template card to select it.

![Template Gallery]({{ '/assets/images/template-gallery.png'
 | relative_url }}){: style="max-width: 500px; width: 100%;" }

After selecting a template, you will be presented with a list of your repositories.
Pick the one where you want to store your new model.
If you have more than 30 repos you may need to page through them to find the one you want.

Once you have picked your target repository, you will be asked to pick a branch.
Again, if you have more than 30 branches you may need to page through.

When you pick a branch you will be taken to the threat model edit page
where you can enter general information about your model.
The template's diagrams, components, and threats will already be populated as a starting point.
The name that you provide for the model will be used as the file name within the repository.

### Loading a template from a local file

In addition to organisation templates, you can also start from a local template file.
This is useful when you have received a template file from a colleague.

**Note**: Template files use a different schema to standard threat model files and are not interchangeable.
To use an existing model as a starting point, first export it as a template using the **Export as Template** option.

From the Template Gallery, click **Start from a Local Template** button to browse for a template file
on your local filesystem.
![Local template image]({{ '/assets/images/local-template.png'
 | relative_url }}){: style="max-width: 500px; width: 100%;" }

The file will be validated to ensure it is a properly formatted Threat Dragon template (metadata + model content).
Once loaded, you can select your target repository and branch just like with organisation templates.
The imported template's diagrams, components, and threats will be used as a starting point for your new threat model.

**Note**: This creates a new model based on the local file, it does not add the template
to your organisation's template repository. Only administrators can add templates to
the shared template gallery.

### Exporting an existing model as a template

If you have created a threat model that would be useful as a template for others,
you can export it as a template file that can be shared or imported later.

From your threat model's details page, click on the manage dropdown and select **Export as Template**.
You will be taken to the export template page where you can review and customise the template details.

![Export template image]({{ '/assets/images/export-template-button.png'
 | relative_url }}){: style="max-width: 400px; width: 100%;" }

![Export template page]({{ '/assets/images/export-template-page.png'
 | relative_url }}){: style="max-width: 1000px; width: 100%;" }

On the export template page, you can:

- Review the template name and description
- Add or modify tags for easier searching

Once you are satisfied with the template details, click **Save Template** to download the
template file to your local filesystem.

The exported template file can then be:

- Shared directly with colleagues, allowing them to create a model from local template without requiring
  it to be stored in the organisation’s template repository.
- Sent to administrators to be added to the organisation's template repository
- Used as a local backup or starting point for future models

**Note**: The export removes any organisation-specific information (such as repository paths)
and generates new unique identifiers, making it suitable for use as a reusable template.

### Managing Templates (Administrators)

Users with **push** or **admin** permissions on the template repository (`GITHUB_CONTENT_REPO`)
are considered administrators and can manage the organisation's shared template gallery.

Administrators will see a **cog icon** in the navigation bar.
Clicking the cog reveals a dropdown menu with a **Manage Templates** option,
which takes you to the Manage Templates page where you can add, edit, and delete templates.

![Manage template image]({{ '/assets/images/manage-template.png'
 | relative_url }}){: style="max-width: 400px; width: 100%;" }

For information on configuring the template repository, see the
[GitHub configuration guide]({{ '/configure/github.html#template-repository-configuration'| relative_url }}).

### Bootstrapping the Template Repository

Before templates can be used, an administrator must initialise the template repository structure.
This creates the necessary folders and metadata files.

1. Authenticate with Threat Dragon using an account that has admin access to the template repository
2. Navigate to the Manage Templates page
3. Click the **Initialise** button (only visible to administrators)
4. The repository will be set up automatically

![Initialise-templates]({{ '/assets/images/initialise-templates.png'
 | relative_url }}){: style="max-width: 600px; width: 100%;" }

This creates the `templates/` directory and `template_info.json` metadata file in the repository.
Bootstrapping only needs to be done once per repository.

### Importing Templates to the Organisation

Administrators can add templates to the shared gallery so all users can access them.

1. Obtain a template file (either exported from an existing model or received from a colleague)
2. Navigate to the Manage Templates page
3. Click the **Add New Template** button (only visible to administrators)
   ![import-templates]({{ '/assets/images/import-template-button.png'
    | relative_url }}){: style="max-width: 170px; width: 100%;"}
4. Select the template file from your local filesystem

The template will now appear in the Template Gallery for all users.

### Updating Template Metadata

Administrators can update a template's name, description, or tags without modifying the template content.

1. Navigate to the Manage Templates page
2. Find the template you want to update
3. Click the kebab menu on the template card and select **Edit**
4. Modify the name, description, or tags as needed

![Kebab-Menu]({{ '/assets/images/kebab-menu.png' | relative_url }})

![Edit-Template]({{ '/assets/images/edit-template.png'
 | relative_url }}){: style="max-width: 400px; width: 100%;" }

### Deleting Templates

Administrators can delete templates from the organisation template repo.

1. Navigate to the Manage Templates page
2. Find the template you want to delete
3. Click the kebab menu on the template card and select **Delete**
4. Confirm the deletion

**Warning**: Deleting a template cannot be undone. Existing threat models created from the
template are not affected, but the template will no longer be available for creating new models.

**Session timeout**: When logging in to an external drive or repository, be aware that sessions
can time out. This timeout length varies by provider; if this is a problem, keep the session
alive using a tab in the same browser window.

## Using the Desktop application

![Start Button]({{ '/assets/images/start.png'| relative_url }})

The threat dragon desktop application can be configured with templates stored in local file system.

For information on how to configure tempaltes in your desktop deployment, see the
[Local configuration guide]({{ '/configure/local.html#configuring-templates-for-desktop' | relative_url }})

![Template button image]({{ '/assets/images/template-button.png'
| relative_url }}){: .float-right style="max-width: 170px; width: 100%;" }

To create a new threat model from a template, go to the Welcome page and click the
**Create model from a Template** button.

You will then be presented with the Template Gallery showing all available templates.
Browse or search for a template that fits your needs, then click on the template card to select it.

![Template Gallery]({{ '/assets/images/template-gallery.png'
 | relative_url }}){: style="max-width: 500px; width: 100%;" }

After selecting a template, you will be taken to the threat model edit screen.
The template's diagrams, components, and threats will be pre-populated,
but metadata fields such as owner, reviewer, and contributors will be empty for you to fill in.

### Loading a template from a file

In addition to templates stored in your configured folder, you can also load a template directly
from any file on your filesystem. This is useful when you have received a template file from a colleague
that you want to use as a one-off starting point without adding it to your gallery.

**Note**: Template files use a different schema to standard threat model files and are not interchangeable.
To use an existing model as a starting point, first export it as a template using the **Export as Template** option.

From the Template Gallery, click the **Start from a Local Template** button to browse for a template file.
![Local template image]({{ '/assets/images/local-template.png'
 | relative_url }}){: style="max-width: 500px; width: 100%;" }

The file will be validated to ensure it is a properly formatted Threat Dragon template.
Once loaded, you will be taken to the threat model edit screen with the template's diagrams,
components,and threats pre-populated.

**Note**: This creates a new model based on the selected file. It does not add the template
to your configured template folder.

### Exporting an existing model as a template on Desktop

If you have created a threat model that would be useful as a template for others,
you can export it as a template file that can be shared or imported later.

From your threat model's details page, click on the manage dropdown and select **Export as Template**.
You will be taken to the export template page where you can review and customise the template details.

![Export template image]({{ '/assets/images/export-template-button.png'
 | relative_url }}){: style="max-width: 400px; width: 100%;" }

![Export template page]({{ '/assets/images/export-template-page.png'
 | relative_url }}){: style="max-width: 1000px; width: 100%;" }

On the export template page, you can:

- Review the template name and description
- Add or modify tags for easier searching

Once you are satisfied with the template details, click **Save Template** to download the
template file to your local filesystem.

The exported template file can then be:

- Shared directly with colleagues so they can use it as a one-off starting point, without needing to add it to their gallery
- Imported into your own template gallery using the 'Manage Templates' portal.
- Used as a local backup or starting point for future models

**Note**: The export removes any model-specific information and generates new unique identifiers,
making it suitable for use as a reusable template.

### Managing Templates

On the desktop application, all users have full administrator access to the template gallery.

Click the **cog icon** in the navigation bar and select **Manage Templates** to open the
Manage Templates page,where you can add, edit, and delete templates.

![Manage template image]({{ '/assets/images/manage-template.png'
 | relative_url }}){: style="max-width: 400px; width: 100%;" }

**Note**: You can only add, edit, or delete templates if you have write access to the configured template folder.
If the folder is read-only, the Manage Templates page will open in read-only mode and modification options will be hidden.

![Manage template image]({{ '/assets/images/read-only-templates-portal.png'
 | relative_url }}){: style="max-width: 700px; width: 100%;"}

For information on configuring the template folder, see the
[Desktop Template Configuration Guide]({{ '/configure/local.html#configuring-templates-for-desktop' | relative_url }}).

### Bootstrapping the Template Folder

On the desktop application, template storage is initialised automatically when you configure a folder location.
Simply navigate to Manage Templates, select a setup option, and Threat Dragon will create the template_info.json
index file in the chosen folder automatically.

No separate initialisation step is required.

### Importing Templates to the Gallery on Desktop

1. Obtain a template file (either exported from an existing model or received from a colleague)
2. Navigate to the Manage Templates portal
3. Click the **Add New Template** button
   ![import-templates]({{ '/assets/images/import-template-button.png'
    | relative_url }}){: style="max-width: 170px; width: 100%;"}
4. Select the template file from your local filesystem

The template will now appear in the Template Gallery.

### Updating Template Metadata on Desktop

You can update a template's name, description, or tags without modifying the template content.

1. Navigate to the Manage Templates page
2. Find the template you want to update
3. Click the kebab menu on the template card and select **Edit**
4. Modify the name, description, or tags as needed

![Kebab-Menu]({{ '/assets/images/kebab-menu.png' | relative_url }})

![Edit-Template]({{ '/assets/images/edit-template.png'
 | relative_url }}){: style="max-width: 400px; width: 100%;" }

### Deleting Templates on Desktop

You can delete templates from your template gallery.

1. Navigate to the Manage Templates page
2. Find the template you want to delete
3. Click the kebab menu on the template card and select **Delete**
4. Confirm the deletion

**Warning**: Deleting a template cannot be undone. Existing threat models created from the
template are not affected, but the template will no longer be available for creating new models.
