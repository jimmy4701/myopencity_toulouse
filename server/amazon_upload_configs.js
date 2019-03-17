import _ from 'lodash'
import {ExternalApisConfiguration} from '/imports/api/external_apis_configuration/external_apis_configuration'

const external_apis_conf = ExternalApisConfiguration.findOne()


Slingshot.fileRestrictions("ConsultImage", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
  maxSize: null
})


Slingshot.fileRestrictions("ConsultImageMini", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
  maxSize: null
})

Slingshot.fileRestrictions("ConsultFile", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.ms-excel", "application/x-rar-compressed"],
  maxSize: null
})

Slingshot.fileRestrictions("BudgetPropositionFile", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.ms-excel"],
  maxSize: 5 * 1024 * 1024 // 5MB
})

Slingshot.fileRestrictions("BudgetPropositionImage", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
  maxSize: 1 * 1024 * 1024 // 1MB
})

if(external_apis_conf){
  if(external_apis_conf.amazon_public_key && external_apis_conf.amazon_private_key && external_apis_conf.amazon_bucket_name && external_apis_conf.amazon_region){
    Slingshot.createDirective("ConsultImage", Slingshot.S3Storage, {
      bucket: external_apis_conf.amazon_bucket_name,
      acl: "public-read",
      AWSAccessKeyId: external_apis_conf.amazon_public_key,
      AWSSecretAccessKey: external_apis_conf.amazon_private_key,
      region: external_apis_conf.amazon_region,

      authorize: function (file, metaContext) {
        if(!this.userId){
          throw new Meteor.Error('403', "Vous devez vous connecter")
        }else{
          return true
        }
      },

      key: function (file, metaContext) {
        // User's image url with ._id attached:
        console.log("metacontext", metaContext);
        const fileNameDecompo = _.split(file.name, '.')
        const url = "images/" + this.userId + "/" + Date.now() + "-" + _.kebabCase(fileNameDecompo[0]) + '.' + fileNameDecompo[fileNameDecompo.length - 1]
        console.log("URL", url);

        return url
      }
    })

    Slingshot.createDirective("ConsultImageMini", Slingshot.S3Storage, {
      bucket: external_apis_conf.amazon_bucket_name,
      acl: "public-read",
      AWSAccessKeyId: external_apis_conf.amazon_public_key,
      AWSSecretAccessKey: external_apis_conf.amazon_private_key,
      region: external_apis_conf.amazon_region,

      authorize: function (file, metaContext) {
        if(!this.userId){
          throw new Meteor.Error('403', "Vous devez vous connecter")
        }else{
          return true
        }
      },

      key: function (file, metaContext) {
        // User's image url with ._id attached:
        console.log("metacontext", metaContext);
        const fileNameDecompo = _.split(file.name, '.')
        const url = "images/" + this.userId + "/mini-" + Date.now() + "-" + _.kebabCase(fileNameDecompo[0]) + '.' + fileNameDecompo[fileNameDecompo.length - 1]
        console.log("URL", url);

        return url
      }
    })

    Slingshot.createDirective("ConsultFile", Slingshot.S3Storage, {
      bucket: external_apis_conf.amazon_bucket_name,
      acl: "public-read",
      AWSAccessKeyId: external_apis_conf.amazon_public_key,
      AWSSecretAccessKey: external_apis_conf.amazon_private_key,
      region: external_apis_conf.amazon_region,

      authorize: function (file, metaContext) {
        if(!this.userId){
          throw new Meteor.Error('403', "Vous devez vous connecter")
        }else{
          return true
        }
      }, 

      key: function (file, metaContext) {
        // User's image url with ._id attached:
        console.log("metacontext", metaContext);
        const fileNameDecompo = _.split(file.name, '.')

        const url = "files/" + this.userId + "/" + Date.now() + "-" + _.kebabCase(metaContext.title) + '.' + fileNameDecompo[fileNameDecompo.length - 1]
        console.log("URL", url);

        return url
      }
    })

    Slingshot.createDirective("BudgetPropositionFile", Slingshot.S3Storage, {
      bucket: external_apis_conf.amazon_bucket_name,
      acl: "public-read",
      AWSAccessKeyId: external_apis_conf.amazon_public_key,
      AWSSecretAccessKey: external_apis_conf.amazon_private_key,
      region: external_apis_conf.amazon_region,

      authorize: function (file, metaContext) {
        if(!this.userId){
          throw new Meteor.Error('403', "Vous devez vous connecter")
        }else{
          return true
        }
      }, 

      key: function (file, metaContext) {
        // User's image url with ._id attached:
        console.log("metacontext", metaContext);
        const fileNameDecompo = _.split(file.name, '.')

        const url = "files/" + this.userId + "/" + Date.now() + "-" + _.kebabCase(metaContext.title) + '.' + fileNameDecompo[fileNameDecompo.length - 1]
        console.log("URL", url);

        return url
      }
    })

    Slingshot.createDirective("BudgetPropositionImage", Slingshot.S3Storage, {
      bucket: external_apis_conf.amazon_bucket_name,
      acl: "public-read",
      AWSAccessKeyId: external_apis_conf.amazon_public_key,
      AWSSecretAccessKey: external_apis_conf.amazon_private_key,
      region: external_apis_conf.amazon_region,

      authorize: function (file, metaContext) {
        if(!this.userId){
          throw new Meteor.Error('403', "Vous devez vous connecter")
        }else{
          return true
        }
      }, 

      key: function (file, metaContext) {
        // User's image url with ._id attached:
        console.log("metacontext", metaContext);
        const fileNameDecompo = _.split(file.name, '.')

        const url = "files/" + this.userId + "/" + Date.now() + "-" + _.kebabCase(metaContext.title) + '.' + fileNameDecompo[fileNameDecompo.length - 1]
        console.log("URL", url);

        return url
      }
    })
  }
}else{
  console.log("SERVER : Slingshot didn't initialized directives, cause no configuration has been found");

}
