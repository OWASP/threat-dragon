# Release process

This process covers release candidates and final releases.
A release version must use the full `v<major>.<minor>.<patch>` format.
A release candidate adds `-RC<number>`, such as `v2.6.3-RC1`.

## Expected outputs

The release workflow creates a ***draft*** GitHub release.
Except for the signed macOS and Windows packages and their updater metadata,
GitHub Actions creates all files.

| Output | Purpose | Created by | SLSA Build L2 |
| --- | --- | --- | --- |
| GitHub source `.zip` and `.tar.gz` | Source archive | GitHub | Not claimed |
| `Threat-Dragon-ng-Setup-<version>.exe` | Windows installer | Actions, then offline Certum signing | No for the final signed file |
| Windows `.exe.blockmap`, `latest.yml`, and `checksum.yml` | Windows updates and checksum | Maintainer after signing | No |
| `Threat-Dragon-ng-<version>.dmg` | macOS AMD64 installer | Actions, then offline Certum signing and notarization | No for the final signed file |
| `Threat-Dragon-ng-<version>-arm64.dmg` | macOS ARM64 installer | Actions, then offline Certum signing and notarization | No for the final signed file |
| macOS `*-mac.zip` files | macOS automatic updates | Actions, then offline Certum signing and notarization | No for the final signed files |
| macOS `.blockmap`, `latest-mac.yml`, and `checksum-mac*.yml` | macOS updates and checksums | Maintainer after signing | No |
| `Threat-Dragon-ng-<version>.AppImage` | Linux portable application | Actions | Yes |
| `threat-dragon_<version>_amd64.deb` | Debian and Ubuntu package | Actions | Yes |
| `threat-dragon-<version>.x86_64.rpm` | RPM package | Actions | Yes |
| `latest-linux.yml` and `checksum-linux.yml` | Linux updates and checksum | Actions | Yes |
| `threat-dragon_<version>_amd64.snap` | Snap Store package | Actions | Yes |
| `threatdragon/owasp-threat-dragon:v<version>` and `stable` | Staging AMD64 and ARM64 container image | Actions | Yes |
| `owasp/threat-dragon:v<version>` and `stable` | Production AMD64 and ARM64 container image | Actions | Yes |
| `owasp/threat-dragon:v<version>-arm64` | ARM64 compatibility container tag | Actions | Yes |
| `sboms.zip` | Combined desktop, server, and container application SBOMs | Actions | Not applicable |
| `sboms-server.zip` | Server SBOM in CycloneDX JSON and XML | Actions | Not applicable |
| `sboms-container-image-app.zip` | Container application SBOMs | Actions | Not applicable |

The ***unsigned*** Windows and macOS files in the Actions run have SLSA Build Level 2 provenance.
Offline signing changes their digests, so that provenance does not apply to the signed release files.
The manually generated blockmaps, checksums, and updater metadata also do not have SLSA provenance.
Blockmaps must be generated *after* code signing so they match the files that Electron Updater downloads.

An immutable release attestation is separate from SLSA provenance.
It binds the final release tag, commit, and published assets after a maintainer publishes the draft.

Snap and Docker Hub distributions are pushed while the release is still in draft. The files are not attached
to the release.

## Workflow behavior

- A manual workflow run builds and attests the artifacts. It does not create a release or publish to Docker Hub or Snapcraft.
- A release candidate tag creates a draft prerelease and publishes its versioned image to
  `threatdragon/owasp-threat-dragon`. It does not change `stable` or publish to any production targets.
- A final release tag creates a normal draft release. It publishes the versioned and `stable` container tags to both
  Docker repositories. It also publishes the Snap package to the stable channel.
- A maintainer signs the Windows and macOS files offline, updates their release files, and publishes the GitHub draft.

## Create a release candidate

Under normal circumstances, we should create at least one release candidate for community review.

1. Start from a clean branch and choose an unused release candidate version.
2. Prepare the package files:

   ```bash
   ./scripts/td-prepare-release.sh v2.6.3-RC1
   ```

3. Commit and push the package changes:

   ```bash
   git add package.json package-lock.json td.vue/package.json td.vue/package-lock.json \
     td.server/package.json td.server/package-lock.json
   git commit -S -m "Prepare v2.6.3-RC1"
   git push
   ```

4. Create and push the signed tag:

   ```bash
   git tag -s v2.6.3-RC1 -m v2.6.3-RC1
   git push origin refs/tags/v2.6.3-RC1
   ```

5. Wait for the release workflow to create the draft prerelease.
6. Complete the draft as described below.
7. Announce the release candidate in the [OWASP Threat Dragon Slack channel][td-slack] and other channels.
8. Restore the development versions, using the final release version as its base:

   ```bash
   ./scripts/td-post-release.sh v2.6.3
   git add package.json package-lock.json td.vue/package.json td.vue/package-lock.json \
     td.server/package.json td.server/package-lock.json
   git commit -S -m "Restore development version after v2.6.3-RC1"
   git push
   ```

Repeat this process for each additional release candidate.

## Create a final release

Create the final release after the community accepts a release candidate.

1. Prepare the package files and documentation version:

   ```bash
   ./scripts/td-prepare-release.sh v2.6.3
   ```

2. Commit and push all release preparation changes.
3. Wait for the push workflows to pass.
4. Create and push the signed final tag:

   ```bash
   git tag -s v2.6.3 -m v2.6.3
   git push origin refs/tags/v2.6.3
   ```

5. Wait for the release workflow to create the draft release.
6. Restore the desktop build state:

   ```bash
   ./scripts/td-post-release.sh v2.6.3
   ```

7. Commit and push the post-release package changes.
8. Complete the draft as described below.

## Verify the workflow output

1. Confirm the GitHub Actions run succeeded
2. Confirm that the GitHub Release is still a draft
3. Compare the assets with the expected outputs table.
4. For a final release, confirm that Snapcraft lists the new release in the stable channel.
5. For a final release, inspect the Docker images:

   ```bash
   docker buildx imagetools inspect threatdragon/owasp-threat-dragon:v2.6.3
   docker buildx imagetools inspect threatdragon/owasp-threat-dragon:stable
   docker buildx imagetools inspect owasp/threat-dragon:v2.6.3
   docker buildx imagetools inspect owasp/threat-dragon:stable
   docker buildx imagetools inspect owasp/threat-dragon:v2.6.3-arm64
   ```

   The normal version and `stable` tags must list `linux/amd64` and `linux/arm64`.

6. Verify the production container provenance:

   ```bash
   gh attestation verify oci://docker.io/owasp/threat-dragon:v2.6.3 --repo OWASP/threat-dragon --bundle-from-oci
   gh attestation verify oci://docker.io/owasp/threat-dragon:v2.6.3-arm64 --repo OWASP/threat-dragon --bundle-from-oci
   ```

## Sign the Windows installer

Perform these steps on the offline Windows signing system.

1. Install Certum proCertum SmartSign, SimplySign Desktop, and the Windows SDK `signtool` utility.
2. Connect to SimplySign and find the certificate thumbprint.
3. From `td.vue`, install the locked packages needed to generate the blockmap:

   ```powershell
   npm clean-install
   ```

4. From the draft release page, download the unsigned installer into one directory. Set these values:

   ```powershell
   $Tag = "v2.6.3"
   $SigningDir = "C:\path\to\release-windows"
   $Installer = Join-Path $SigningDir "Threat-Dragon-ng-Setup-2.6.3.exe"
   ```

5. Verify the unsigned installer provenance before signing:

   ```powershell
   gh attestation verify $Installer --repo OWASP/threat-dragon
   ```

6. Sign and verify the installer:

   ```powershell
   signtool sign /sha1 "<thumbprint>" /tr http://time.certum.pl /td sha256 /fd sha256 /v $Installer
   signtool verify /pa /all /v $Installer
   ```

7. From the repository root, generate the blockmap, updater metadata, and checksum.
   The script verifies the signature and target draft before it uploads the files:

   ```powershell
   .\scripts\td-finish-windows-release.ps1 -Tag $Tag -ArtifactDirectory $SigningDir
   ```

## Sign and notarize the macOS packages

Perform these steps on the offline macOS signing system.

1. Install SimplySign Desktop and connect the Certum code-signing certificate.
   Use `security find-identity -v -p codesigning` to find the exact signing identity.
2. Create a `notarytool` keychain profile if the signing system does not already have one.
   This command prompts for the Apple credentials:

   ```bash
   xcrun notarytool store-credentials "threat-dragon-notary"
   ```

3. From `td.vue`, install the locked packages needed for signing and blockmap generation:

   ```bash
   npm clean-install
   ```

4. Open the release workflow run in GitHub. Download and extract the `release-macos-unsigned` artifact.
5. From the repository root, set the release values. `SIGNING_DIR` must be the extracted `macos` directory:

   ```bash
   TAG=v2.6.3
   VERSION="${TAG#v}"
   SIGNING_DIR="/path/to/release-macos-unsigned/macos"
   MACOS_SIGNING_IDENTITY="<Certum code-signing identity>"
   NOTARY_PROFILE="threat-dragon-notary"
   ```

6. Verify the provenance of all four unsigned packages before signing:

   ```bash
   gh attestation verify "$SIGNING_DIR/Threat-Dragon-ng-$VERSION-mac.zip" \
     --repo OWASP/threat-dragon
   gh attestation verify "$SIGNING_DIR/Threat-Dragon-ng-$VERSION-arm64-mac.zip" \
     --repo OWASP/threat-dragon
   gh attestation verify "$SIGNING_DIR/Threat-Dragon-ng-$VERSION.dmg" --repo OWASP/threat-dragon
   gh attestation verify "$SIGNING_DIR/Threat-Dragon-ng-$VERSION-arm64.dmg" --repo OWASP/threat-dragon
   ```

7. Sign the AMD64 package first. Set its ZIP, DMG, and temporary work directory:

   ```bash
   ZIP="$SIGNING_DIR/Threat-Dragon-ng-$VERSION-mac.zip"
   DMG="$SIGNING_DIR/Threat-Dragon-ng-$VERSION.dmg"
   WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/threat-dragon-signing-x64.XXXXXX")"
   ```

8. Extract and sign the application. This uses the Electron signing tool from the locked desktop dependencies:

   ```bash
   ditto -x -k "$ZIP" "$WORK_DIR"
   APP="$WORK_DIR/Threat-Dragon-ng.app"
   td.vue/node_modules/.bin/electron-osx-sign "$APP" --identity="$MACOS_SIGNING_IDENTITY"
   codesign --verify --deep --strict --verbose=2 "$APP"
   ```

9. Notarize the signed application, staple its ticket, and recreate the ZIP:

   ```bash
   ditto -c -k --sequesterRsrc --keepParent "$APP" "$WORK_DIR/notarization.zip"
   xcrun notarytool submit --keychain-profile "$NOTARY_PROFILE" --wait "$WORK_DIR/notarization.zip"
   xcrun stapler staple --verbose "$APP"
   xcrun stapler validate "$APP"
   mv "$ZIP" "$ZIP.unsigned"
   ditto -c -k --sequesterRsrc --keepParent "$APP" "$ZIP"
   ```

10. Replace the unsigned application in the DMG with the signed and stapled application:

    ```bash
    mv "$DMG" "$DMG.unsigned"
    hdiutil convert "$DMG.unsigned" -format UDRW -o "$WORK_DIR/read-write"
    mkdir "$WORK_DIR/volume"
    hdiutil attach "$WORK_DIR/read-write.dmg" -readwrite -noautoopen -mountpoint "$WORK_DIR/volume"
    rm -rf "$WORK_DIR/volume/Threat-Dragon-ng.app"
    ditto "$APP" "$WORK_DIR/volume/Threat-Dragon-ng.app"
    hdiutil detach "$WORK_DIR/volume"
    hdiutil convert "$WORK_DIR/read-write.dmg" -format UDZO -o "$DMG"
    ```

11. Notarize, staple, and verify the final DMG:

    ```bash
    xcrun notarytool submit --keychain-profile "$NOTARY_PROFILE" --wait "$DMG"
    xcrun stapler staple --verbose "$DMG"
    xcrun stapler validate "$DMG"
    spctl --assess --type open --context context:primary-signature --verbose=2 "$DMG"
    ```

12. Repeat steps 7 through 11 for ARM64 with these values:

    ```bash
    ZIP="$SIGNING_DIR/Threat-Dragon-ng-$VERSION-arm64-mac.zip"
    DMG="$SIGNING_DIR/Threat-Dragon-ng-$VERSION-arm64.dmg"
    WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/threat-dragon-signing-arm64.XXXXXX")"
    ```

13. From the repository root, generate the four blockmaps, updater metadata, and checksums.
    The script verifies the signed packages and target draft before it uploads the files:

    ```bash
    ./scripts/td-finish-macos-release.sh "$TAG" "$SIGNING_DIR"
    ```

## Complete the draft release

1. Confirm that every expected GitHub asset is present.
2. Confirm the Windows and macOS signatures.
3. Confirm that each signed Windows and macOS file has its final blockmap and updater metadata.
4. Verify the Linux provenance. For example:

   ```bash
   gh attestation verify Threat-Dragon-ng-2.6.3.AppImage --repo OWASP/threat-dragon
   ```

5. Update the draft body from `.release-note-template.md`.
   Remove irrelevant generated entries from the change list, such as chores.
6. Publish the draft. ***Releases are immutable*** - you cannot change assets after publishing.

## Check the deployed release

1. Check the [Heroku dashboard][herokudash] for a rollback.
2. Check the version on the [Heroku app][herokuapp] and [demo site][demo].
3. Test the desktop installers on Windows, Linux, and macOS.
4. Test the Docker image.
5. Confirm the release in the [Snapcraft dashboard][snapdash].
6. Announce the release in the [OWASP Threat Dragon Slack channel][td-slack] and other relevant channels.

[demo]: https://www.threatdragon.com/#/
[herokuapp]: https://threatdragon-v2.herokuapp.com/#/
[herokudash]: https://dashboard.heroku.com/apps
[snapdash]: https://snapcraft.io/threat-dragon/releases
[td-slack]: https://owasp.slack.com/messages/CURE8PQ68
