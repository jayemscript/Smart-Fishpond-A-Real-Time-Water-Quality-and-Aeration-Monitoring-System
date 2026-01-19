'use client';

import React, { useState } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import useFormModalLogic from './user-form.logic';
import { UserFormModalProps } from './user-form.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckIcon, XIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RolePicker from './role-picker';
import PermissionPicker from './permission-picker';
import AccessPicker from './access-picker';
import { OTPInput, SlotProps } from 'input-otp';
import { cn } from '@/lib/utils';

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  close,
  mode = 'add',
  onSuccess,
  initialData = null,
}) => {
  const {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleSubmit,
    handleReset,
    formData,
    setFormData,
    confirmPassword,
    setConfirmPassword,
    emailError,
    setEmailError,
    handleChange,
    handleUsernameChange,
    showPassword,
    togglePasswordVisibility,
    passwordStrength,
    passwordScore,
    getPasswordStrengthColor,
    getPasswordStrengthText,
    selectedPermission,
    setSelectedPermission,
  } = useFormModalLogic(open, close, mode, initialData, onSuccess);

  return (
    <>
      <Modal
        width="!max-w-[90vw]"
        open={open}
        close={() => openConfirm('close')}
        title={mode === 'edit' ? 'Edit User' : 'Create User'}
        footerChildren={
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => openConfirm('reset')}
            >
              Reset
            </Button>

            <Button
              type="submit"
              form="form"
              disabled={false} // you can control this with state if needed
            >
              {mode === 'edit' ? 'Update User' : 'Create User'}
            </Button>
          </div>
        }
      >
        {/* Modal content */}
        <form id="form" onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="role">Role</Label>
              <RolePicker
                value={formData.roleId}
                onSelect={(role) =>
                  setFormData((prev) => ({
                    ...prev,
                    roleId: role,
                  }))
                }
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="access">Page Access Routes</Label>
              <AccessPicker
                value={formData.access || []}
                onSelect={(selectedStrings) =>
                  setFormData((prev) => ({
                    ...prev,
                    access: selectedStrings,
                  }))
                }
                selectedRole={formData.roleId} // Pass the selected role
              />
            </div>
            {/* <div className="flex flex-col space-y-2">
              <Label htmlFor="emp">Assign Employee</Label>
              <EmployeePicker
                value={formData.employeeId}
                onSelect={(emp) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeId: emp,
                  }))
                }
              />
            </div> */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleUsernameChange}
                placeholder="Username"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="permission">User Permission</Label>
              <PermissionPicker
                value={selectedPermission}
                onSelect={(permission) => setSelectedPermission(permission)}
              />
            </div>

            {/* hide 2 factor 
            <div className="flex flex-col space-y-2">
              <Label className="mb-2" htmlFor="passKey">
                2FA Passkey
              </Label>

              <div className="flex items-center justify-center">
                <OTPInput
                  id="passKey"
                  value={formData.passKey}
                  onChange={(val: string) =>
                    setFormData((prev) => ({ ...prev, passKey: val }))
                  }
                  containerClassName="flex items-center gap-3 justify-center"
                  maxLength={6}
                  render={({ slots }) => (
                    <div className="flex gap-3 w-full justify-center">
                      {slots.map((slot, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'h-12 w-12 flex items-center justify-center text-xl font-medium rounded-md border transition-all',
                            slot.isActive
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background text-foreground',
                          )}
                        >
                          {slot.char ?? ''}
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center mt-2">
                {mode === 'add'
                  ? 'Enter your 6-digit passkey for 2FA authentication.'
                  : 'Update your 6-digit passkey for 2FA authentication.'}
              </p>
            </div>
            */}

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="pe-9" // ensures padding for the eye button
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              </div>

              {/* Password strength bar */}
              <div className="bg-border mt-1 mb-2 h-1 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full ${getPasswordStrengthColor(
                    passwordScore,
                  )} transition-all duration-500 ease-out`}
                  style={{ width: `${(passwordScore / 4) * 100}%` }}
                ></div>
              </div>

              <p className="text-sm font-medium mb-2">
                {getPasswordStrengthText(passwordScore)}. Must contain:
              </p>
              <ul className="space-y-1.5">
                {passwordStrength.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {req.met ? (
                      <CheckIcon size={16} className="text-emerald-500" />
                    ) : (
                      <XIcon size={16} className="text-muted-foreground/80" />
                    )}
                    <span
                      className={`text-xs ${
                        req.met ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}
                    >
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </form>
      </Modal>

      {currentDialog && (
        <AlertDialog
          isOpen={true}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          title={currentDialog.title}
          description={currentDialog.description}
          isProceed={currentDialog.proceed}
          isCanceled={currentDialog.cancel}
          icon={currentDialog.icon}
        />
      )}
    </>
  );
};

export default UserFormModal;
